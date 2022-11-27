import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedOrg, getMockedOrgMemberships, getMockedUser, getMockedUserForOrgMembership, getMockedUserForSystemAdmin } from '../mockUtils';

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
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non org owner', async () => {
        const org = await getMockedOrg();
        const orgMember = await getMockedUserForOrgMembership({ entity: org, role: 'MEMBER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgMember.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for an org owner', async () => {
        const org = await getMockedOrg();
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
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
        const orgMemberships = await getMockedOrgMemberships();
        const orgMembershipsCount = orgMemberships.length;
        const nonMember = await getMockedUserForOrgMembership({ entity: org }, false);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({
                user: nonMember,
                entity: org,
                role: 'MEMBER'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
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
                    role: 'MEMBER'
                });
                const updatedOrgMemberships = await getMockedOrgMemberships();
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for an org owner', async () => {
        const org = await getMockedOrg();
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        const nonMember = await getMockedUserForOrgMembership({ entity: org }, false);
        const orgMemberships = await getMockedOrgMemberships();
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .post(`/orgs/${org.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
            .send({
                user: nonMember,
                entity: org,
                role: 'OWNER'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
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
                    role: 'OWNER'
                });
                const updatedOrgMemberships = await getMockedOrgMemberships();
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
});
