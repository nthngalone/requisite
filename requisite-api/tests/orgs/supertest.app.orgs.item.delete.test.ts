import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedOrgs } from '../mockUtils';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('DELETE /orgs/:orgId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true}))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when not a sys admin', async () => {
        const org = await getMockedOrg();
        const orgOwnerBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        const orgMemberBearer = await getMockedAuthBearerForOrgMembership({
            entity: org,
            role: OrganizationRole.OWNER
        });
        await request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', orgOwnerBearer)
            .expect(403, 'Not Authorized');
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', orgMemberBearer)
            .expect(403, 'Not Authorized');
    });
    test('returns a 404 Not Found response for an unknown index', async () => {
        return request(getApp())
            .delete('/orgs/12345')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with when the request body is valid', async () => {
        const org = await getMockedOrg();
        const orgs = await getMockedOrgs();
        const orgsCount = orgs.length;
        return request(getApp())
            .delete(`/orgs/${org.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async () => {
                const updatedOrgs = await getMockedOrgs();
                expect(updatedOrgs.length).toBe(orgsCount - 1);
            });
    });
});
