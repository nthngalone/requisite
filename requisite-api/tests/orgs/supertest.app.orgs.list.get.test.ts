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
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 with all org data if a valid auth header is present for a system admin', async () => {
        const orgs = await getMockedOrgs();
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual(orgs);
            });
    });
    test('returns a 200 with membership specific org data for an org owner', async () => {
        const orgs = await getMockedOrgs();
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([orgs[0]]);
            });
    });
    test('returns a 200 with membership specific org data for an org member', async () => {
        const orgs = await getMockedOrgs();
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([orgs[0]]);
            });
    });
    test('returns a 200 with membership specific org data for an org member with multiple orgs', async () => {
        const orgs = await getMockedOrgs();
        return request(getApp())
            .get('/orgs')
            .set('Authorization', 'Bearer valid|local|org0and1Member')
            .expect(200)
            .then((res) => {
                const results = res.body as Organization[];
                expect(results).toEqual([orgs[0], orgs[1]]);
            });
    });
});
