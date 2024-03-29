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

describe('GET /orgs/:orgId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for an org owner, member, or sysadmin', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser())
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        return request(getApp())
            .get('/orgs/abc')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        return request(getApp())
            .get('/orgs/12345')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: org.id,
                    name: org.name
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for an org owner', async () => {
        const org = await getMockedOrg();
        const orgOwnerBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', orgOwnerBearer)
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: org.id,
                    name: org.name
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for an org member', async () => {
        const org = await getMockedOrg();
        const orgMemberBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.MEMBER
        });
        return request(getApp())
            .get(`/orgs/${org.id}`)
            .set('Authorization', orgMemberBearer)
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: org.id,
                    name: org.name
                });
            });
    });
});
