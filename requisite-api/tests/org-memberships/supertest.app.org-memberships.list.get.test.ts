import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';
import { getMockedOrg, getMockedOrgMemberships, getMockedUser, getMockedUserForOrgMembership, getMockedUserForSystemAdmin } from '../mockUtils';

configure('ERROR');

describe('GET /orgs/<orgId>/memberships', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        const org = await getMockedOrg();
        const nonMemb = await getMockedUserForOrgMembership({ entity: org }, false);
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${nonMemb.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with membership data if a valid auth header is present for a system admin', async () => {
        const org = await getMockedOrg();
        const sysAdmin = await getMockedUserForSystemAdmin();
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(results.length === orgMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === org.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    orgMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for an owner of an org', async () => {
        const org = await getMockedOrg();
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(results.length === orgMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === org.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    orgMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for a member of an org', async () => {
        const org = await getMockedOrg();
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        const orgMember = await getMockedUserForOrgMembership({ entity: org, role: 'MEMBER' });
        return request(getApp())
            .get(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgMember.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(results.length === orgMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === org.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    orgMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
});
