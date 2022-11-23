import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getSequelize } from '../../src/services/sqlz/SqlzUtils';
import Product from '@requisite/model/lib/product/Product';
import OrganizationsDataModel from '../../src/services/sqlz/data-models/OrganizationsDataModel';
import Membership from '@requisite/model/lib/user/Membership';
import OrgMembershipsDataModel from '../../src/services/sqlz/data-models/OrgMembershipsDataModel';

async function getMockedOrgMemberships(): Promise<Membership<Organization>[]> {
    OrganizationsDataModel.initialize(await getSequelize());
    return (await OrgMembershipsDataModel.findAll()).map(
        o => OrgMembershipsDataModel.toOrgMembership(o)
    );
}

configure('ERROR');

describe('POST /org/<orgId>/memberships', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non org owner', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for an org owner', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a user for an org membership', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ user: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only an entity for an org membership', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ entity: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a role for an org membership', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ role: 'OWNER' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a user and a role for an org membership', async () => {
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
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
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
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
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
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
        const orgMemberships = await getMockedOrgMemberships();
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({
                user: { id: 0 },
                entity: { id: 0 },
                role: 'OWNER'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({ id: 0 }),
                    entity: expect.objectContaining({ id: 0 }),
                    role: 'OWNER'
                });
                const updatedOrgMemberships = await getMockedOrgMemberships();
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for an org owner', async () => {
        const orgMemberships = await getMockedOrgMemberships();
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .post('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({
                user: { id: 0 },
                entity: { id: 0 },
                role: 'OWNER'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({ id: 0 }),
                    entity: expect.objectContaining({ id: 0 }),
                    role: 'OWNER'
                });
                const updatedOrgMemberships = await getMockedOrgMemberships();
                expect(updatedOrgMemberships.length).toBe(orgMembershipsCount+1);
            });
    });
});
