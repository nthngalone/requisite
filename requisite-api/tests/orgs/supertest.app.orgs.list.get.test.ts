import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { getAuthBearer, getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedOrgMembership, getMockedOrgs, getMockedUser } from '../mockUtils';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('GET /orgs', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/orgs')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/orgs')
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs')
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 with all org data if a valid auth header is present for a system admin', async () => {
        const orgs = await getMockedOrgs();
        return request(getApp())
            .get('/orgs')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual(orgs);
            });
    });
    test('returns a 200 with membership specific org data for an org owner', async () => {
        const org = await getMockedOrg();
        const orgOwnerBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        return request(getApp())
            .get('/orgs')
            .set('Authorization', orgOwnerBearer)
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([org]);
            });
    });
    test('returns a 200 with membership specific org data for an org member', async () => {
        const org = await getMockedOrg();
        const orgMemberBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.MEMBER
        });
        return request(getApp())
            .get('/orgs')
            .set('Authorization', orgMemberBearer)
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([org]);
            });
    });
    test('returns a 200 with membership specific org data for an org member with multiple orgs', async () => {
        const org1 = await getMockedOrg();
        const org2 = await getMockedOrg();
        const user = await getMockedUser();
        await getMockedOrgMembership({
            user,
            entity: org1,
            role: OrganizationRole.MEMBER
        });
        await getMockedOrgMembership({
            user,
            entity: org2,
            role: OrganizationRole.MEMBER
        });
        return request(getApp())
            .get('/orgs')
            .set('Authorization', getAuthBearer(user))
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([org1, org2]);
            });
    });
});
