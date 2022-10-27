import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import OrganizationsDataModel from '../../src/services/sqlz/data-models/OrganizationsDataModel';
import { getSequelize } from '../../src/services/sqlz/SqlzUtils';

async function getMockedOrgs(): Promise<Organization[]> {
    OrganizationsDataModel.initialize(await getSequelize());
    return (await OrganizationsDataModel.findAll()).map(
        o => OrganizationsDataModel.toOrganization(o)
    );
}

configure('ERROR');

describe('POST /orgs', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .post('/orgs')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non system admin is present', async () => {
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 1 error when the request body is empty for a system admin', async () => {
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const orgs = await getMockedOrgs();
        const orgsCount = orgs.length;
        return request(getApp())
            .post('/orgs')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({ name: 'Organization Create Test'})
            .expect(200)
            .then(async (res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: expect.any(Number),
                    name: 'Organization Create Test'
                });
                const udpatedOrgs = await getMockedOrgs();
                expect(udpatedOrgs.length).toBe(orgsCount+1);
            });
    });
});
