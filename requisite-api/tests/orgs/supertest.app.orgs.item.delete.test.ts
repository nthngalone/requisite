import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import OrganizationsDataModel from '../../src/services/sqlz/data-models/OrganizationsDataModel';
import { getSequelize } from '../../src/services/sqlz/SqlzUtils';

async function getMockedOrgs(): Promise<Organization[]> {
    OrganizationsDataModel.initialize(await getSequelize());
    return (await OrganizationsDataModel.findAll()).map(
        o => OrganizationsDataModel.toOrganization(o)
    );
}

configure('ERROR');

describe('DELETE /orgs/:orgId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .delete('/orgs/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when not a sys admin', async () => {
        await request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .expect(403, 'Not Authorized');
        return request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 404 Not Found response for an unknown index', async () => {
        return request(getApp())
            .delete('/orgs/123')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(404, 'Not Found');
    });
    test('returns a 200 with when the request body is valid', async () => {
        const orgs = await getMockedOrgs();
        const orgsCount = orgs.length;
        return request(getApp())
            .delete('/orgs/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then(async () => {
                const updatedOrgs = await getMockedOrgs();
                expect(updatedOrgs.length).toBe(orgsCount - 1);
            });
    });
});
