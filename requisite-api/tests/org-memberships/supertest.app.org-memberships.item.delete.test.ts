import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getAuthBearer, getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedOrgMembership, getMockedOrgMemberships, getMockedUserForOrgMembership } from '../mockUtils';

configure('ERROR');

describe('DELETE /orgs/<orgId>/memberships/<orgMembershipId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for an org owner', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        const orgMemberAuthBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: 'MEMBER'
        });
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', orgMemberAuthBearer)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/abc`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/12345`) // a ridiculous id that should never exist in the mocked data
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const org = await getMockedOrg();
        const membershipToDelete = await getMockedOrgMembership({ entity: org, role: 'MEMBER' });
        const orgMemberships = await getMockedOrgMemberships({ entity: org });
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async () => {
                const newOrgMemberships
                    = (await getMockedOrgMemberships({ entity: org }));
                const newOrgMembershipsCount = newOrgMemberships.length;
                expect(newOrgMembershipsCount).toBe(orgMembershipsCount - 1);
            });
    });
    test('returns a 200 with data when a valid auth header is present for an org owner', async () => {
        const org = await getMockedOrg();
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        const membershipToDelete = await getMockedOrgMembership({ entity: org });
        const orgMemberships = (await getMockedOrgMemberships({ entity: org }));
        const orgMembershipsCount = orgMemberships.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/memberships/${membershipToDelete.id}`)
            .set('Authorization', getAuthBearer(orgOwner))
            .expect(200)
            .then(async () => {
                const newOrgMemberships
                    = (await getMockedOrgMemberships({ entity: org }));
                const newOrgMembershipsCount = newOrgMemberships.length;
                expect(newOrgMembershipsCount).toBe(orgMembershipsCount - 1);
            });
    });
});
