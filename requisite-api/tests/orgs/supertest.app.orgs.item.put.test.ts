import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg } from '../mockUtils';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('PUT /orgs/:orgId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response for an org member', async () => {
        const org = await getMockedOrg();
        const orgMemberBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.MEMBER
        });
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', orgMemberBearer)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 1 error when the request body is empty', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response for a valid body with an unknown index', async () => {
        return request(getApp())
            .put('/orgs/12345')
            .send({ name: 'Organization 12345 - Updated'})
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({ name: `${org.name} - Updated` })
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: org.id,
                    name: `${org.name} - Updated`
                });
            });
    });
    test('returns a 200 with the new record when the request body is valid by a org owner', async () => {
        const org = await getMockedOrg();
        const orgOwnerBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        return request(getApp())
            .put(`/orgs/${org.id}`)
            .set('Authorization', orgOwnerBearer)
            .send({ name: `${org.name} - Updated` })
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: org.id,
                    name: `${org.name} - Updated`
                });
            });
    });
});
