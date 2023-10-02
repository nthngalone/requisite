/* eslint-disable @typescript-eslint/no-explicit-any */
import type Organization from '@requisite/model/lib/org/Organization';
import { getSecuredClient } from '../ClientUtils';
import reqData from '../../../../requisite-api/requisite-data';
import type User from '@requisite/model/lib/user/User';

const reqOrgData = (reqData as unknown as Record<string, Organization>).organization;
const usersData = (reqData as unknown as Record<string, User[]>).users;

function getUserForOrg(orgRole: string): User {
    const { user: orgUser } = reqOrgData.memberships.find(
        membership => membership.role === orgRole
    );
    return usersData.find(
        (user) => user.userName === orgUser.userName
    );
}

function getUserForProduct(productName: string, productRole: string): User {
    const product = reqOrgData.products.find(
        productData => productData.name === productName
    );
    const { user: productUser } = product.memberships.find(
        membership => membership.role === productRole
    );
    return usersData.find(
        (user) => user.userName === productUser.userName
    );
}

describe('requisite init data', () => {
    test('list organizations for system admin', async () => {
        const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.get('/orgs');
        expect(status).toBe(200);
        // assert that org listed in the requisite data is returned
        expect(data).toEqual(expect.arrayContaining([expect.objectContaining({
            name: reqOrgData.name
        })]));
    });
    test('list requisite organization for organization owner', async () => {
        const { DEFAULT_USER_PASSWORD } = process.env;
        const user = getUserForOrg('OWNER');
        const client = await getSecuredClient(
            user.domain,
            user.userName,
            DEFAULT_USER_PASSWORD
        );
        const { status, data } = await client.get('/orgs');
        expect(status).toBe(200);
        // assert that org listed in the requisite data is returned as the only org
        expect(data).toEqual([expect.objectContaining({
            name: reqOrgData.name
        })]);
    });
    test('list requisite organization for organization member', async () => {
        const { DEFAULT_USER_PASSWORD } = process.env;
        const user = getUserForOrg('MEMBER');
        const client = await getSecuredClient(
            user.domain,
            user.userName,
            DEFAULT_USER_PASSWORD
        );
        const { status, data } = await client.get('/orgs');
        expect(status).toBe(200);
        // assert that org listed in the requisite data is returned as the only org
        expect(data).toEqual([expect.objectContaining({
            name: reqOrgData.name
        })]);
    });
    test('list products for system admin', async () => {
        const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { data: orgsData } = await client.get('/orgs');
        const orgs = orgsData as Organization[];
        const reqOrg = orgs.find(org => org.name === reqOrgData.name);
        const { status, data } = await client.get(`/orgs/${reqOrg.id}/products`);
        expect(status).toBe(200);
        reqOrgData.products.forEach((productData) => {
            expect(data).toEqual(expect.arrayContaining([expect.objectContaining({
                name: productData.name
            })]));
        });
    });
    test('list requisite product for product owner', async () => {
        const { DEFAULT_USER_PASSWORD } = process.env;
        const user = getUserForProduct('requisite', 'CONTRIBUTOR');
        const client = await getSecuredClient(
            user.domain,
            user.userName,
            DEFAULT_USER_PASSWORD
        );
        const { data: orgsData } = await client.get('/orgs');
        const orgs = orgsData as Organization[];
        const reqOrg = orgs.find(org => org.name === reqOrgData.name);
        const { status, data } = await client.get(`/orgs/${reqOrg.id}/products`);
        expect(status).toBe(200);
        expect(data).toEqual([expect.objectContaining({
            name: reqOrgData.products[0].name
        })]);
    });
    test('list requisite product for product stakeholder', async () => {
        const { DEFAULT_USER_PASSWORD } = process.env;
        const user = getUserForProduct('requisite', 'STAKEHOLDER');
        const client = await getSecuredClient(
            user.domain,
            user.userName,
            DEFAULT_USER_PASSWORD
        );
        const { data: orgsData } = await client.get('/orgs');
        const orgs = orgsData as Organization[];
        const reqOrg = orgs.find(org => org.name === reqOrgData.name);
        const { status, data } = await client.get(`/orgs/${reqOrg.id}/products`);
        expect(status).toBe(200);
        expect(data).toEqual([expect.objectContaining({
            name: reqOrgData.products[0].name
        })]);
    });
    test('list requisite product for product contributor', async () => {
        const { DEFAULT_USER_PASSWORD } = process.env;
        const user = getUserForProduct('requisite', 'CONTRIBUTOR');
        const client = await getSecuredClient(
            user.domain,
            user.userName,
            DEFAULT_USER_PASSWORD
        );
        const { data: orgsData, status: orgsStatus } = await client.get('/orgs');
        expect(orgsStatus).toBe(200);
        const orgs = orgsData as Organization[];
        const reqOrg = orgs.find(org => org.name === reqOrgData.name);
        const { status, data } = await client.get(`/orgs/${reqOrg.id}/products`);
        expect(status).toBe(200);
        expect(data).toEqual([expect.objectContaining({
            name: reqOrgData.products[0].name
        })]);
    });
});

