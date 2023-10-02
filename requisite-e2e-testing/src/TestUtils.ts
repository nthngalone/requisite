/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient, getSecuredClient } from './api/ClientUtils';
import { asyncForEachParallel } from '@requisite/utils/lib/lang/ArrayUtils';
import random from 'crypto-random-string';
import type User from '@requisite/model/lib/user/User';
import type SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import type Organization from '@requisite/model/lib/org/Organization';
import { AxiosInstance } from 'axios';
import { assertTrue } from '@requisite/utils/lib/validation/AssertionUtils';
import type Membership from '@requisite/model/lib/user/Membership';

let testUserCount = 0;
let testOrgCount = 0;

export const testUserNamePrefix = 'E2ETestUser';
export const testOrgNamePrefix = 'E2ETestOrg';

export async function createTestUser(): Promise<User> {
    testUserCount++;
    const password = random({ length: 10 });

    const ts = getTs();
    const userName = `${testUserNamePrefix}${getTs()}${testUserCount}`;

    const user: any = {
        domain: 'local',
        userName,
        emailAddress: `e2eTestUser${ts}${testUserCount}@requisite.io`,
        name: {
            firstName: 'Test',
            lastName: `User${ts}${testUserCount}`
        },
        password,
        termsAgreement: true
    };

    const { data } = await getClient().post('/security/register', user);
    user.id = data.id;
    return user;
}

export async function deleteCreatedUsers(): Promise<void> {
    const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;
    const client = await getSecuredClient(
        SYSADMIN_DOMAIN,
        SYSADMIN_USERNAME,
        SYSADMIN_PASSWORD
    );
    const { status: usersStatus, data: users } = await client.get('/users');
    const { status: sysAdminsStatus, data: sysAdmins } = await client.get('/system/admins');
    assertTrue(usersStatus === 200, 'users retrieval successful status code');
    assertTrue(sysAdminsStatus === 200, 'system admins retrieval successful status code');
    await asyncForEachParallel(users, async (user: User) => {
        const sysAdmin = sysAdmins.find(
            (admin: SystemAdmin) => admin.user.id === user.id
        );
        if (sysAdmin) {
            await client.delete(`/system/admin/${sysAdmin.id}`);
        }
        const { userName, id } = user as never;
        if ((userName as string).indexOf(testUserNamePrefix) === 0) {
            await client.delete(`/users/${id}`);
        }
    });
}

export async function afterAllDeleteCreatedUsers(): Promise<void> {
    await deleteCreatedUsers();
}

export async function createTestOrg(securedClient: AxiosInstance): Promise<Organization> {
    testOrgCount++;
    const name = `${testOrgNamePrefix}${testOrgCount}${getTs()}`;
    const { data } = await securedClient.post('/orgs', { name });
    return data;
}

export async function deleteCreatedOrgs(): Promise<void> {
    const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;
    const client = await getSecuredClient(
        SYSADMIN_DOMAIN,
        SYSADMIN_USERNAME,
        SYSADMIN_PASSWORD
    );
    const { data: orgsData } = await client.get('/orgs');
    const orgs: Organization[] = orgsData;
    await asyncForEachParallel(orgs, async (org: Organization) => {
        const { id, name } = org as never;
        if ((name as string).indexOf(testOrgNamePrefix) === 0) {
            await client.delete(`/orgs/${id}`);
            const { status, data: membershipsData } = await client.get(`/orgs/${id}/memberships`);
            if (status == 200) {
                const memberships: Membership<Organization>[] = membershipsData;
                await asyncForEachParallel(
                    memberships,
                    async (membership: Membership<Organization>) => {
                        client.delete(`/orgs/${id}/memberships/${membership.id}`);
                    }
                );
            }
        }
    });
}

export async function afterAllDeleteCreatedOrgs(): Promise<void> {
    await deleteCreatedOrgs();
}

function getTs(): string {
    return `${new Date().getTime()}`.substring(4);
}
