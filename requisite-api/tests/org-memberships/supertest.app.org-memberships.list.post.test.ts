import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getAuthBearer, getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedOrgMemberships, getMockedUser, getMockedUserForOrgMembership } from '../mockUtils';
import Membership, { OrganizationRole } from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';

configure('ERROR');

describe('POST /org/<orgId>/memberships', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.MEMBER
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for an org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a user for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({ user: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only an entity for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({ entity: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a role for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({ role: 'OWNER' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a user and a role for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({
                user: { id: 0 },
                role: 'OWNER'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a entity and a role for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({
                entity: { id: 0 },
                role: 'OWNER'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a user and an entity for an org membership', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({
                user: { id: 0 },
                entity: { id: 0 }
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const org = await getMockedOrg();
        const nonMember = await getMockedUser();
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                user: nonMember,
                entity: org,
                role: OrganizationRole.MEMBER
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({
                        id: nonMember.id,
                        userName: nonMember.userName
                    }),
                    entity: expect.objectContaining({
                        id: org.id,
                        name: org.name
                    }),
                    role: OrganizationRole.MEMBER
                });
                const updatedOrgMemberships = await getMockedOrgMemberships(
                    { entity: org }
                );
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for an org owner', async () => {
        const org = await getMockedOrg();
        const nonMember = await getMockedUser();
        const orgOwner = await getMockedUserForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', getAuthBearer(orgOwner))
            .send({
                user: nonMember,
                entity: org,
                role: OrganizationRole.OWNER
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({
                        id: nonMember.id,
                        userName: nonMember.userName
                    }),
                    entity: expect.objectContaining({
                        id: org.id,
                        name: org.name
                    }),
                    role: OrganizationRole.OWNER
                });
                const updatedOrgMemberships = await getMockedOrgMemberships(
                    { entity: org }
                );
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
});
