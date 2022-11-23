import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('GET /orgs/<orgId>/memberships', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with membership data if a valid auth header is present for a system admin', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(
                    results.every(membership => membership.entity.id === 0)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0Owner'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0MemberProduct0Owner'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0and1Member'
                        })
                    })
                ]));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for an owner of an org', async () => {
        return request(getApp())
            .get('/orgs/0/memberships')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(
                    results.every(membership => membership.entity.id === 0)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0Owner'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0MemberProduct0Owner'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0and1Member'
                        })
                    })
                ]));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for a member of an org', async () => {
        return request(getApp())
            .get('/orgs/1/memberships')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Stakeholder')
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Organization>[];
                expect(
                    results.every(membership => membership.entity.id === 1)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org1MemberProduct2Owner'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org1MemberProduct2Stakeholder'
                        })
                    }), expect.objectContaining({
                        user: expect.objectContaining({
                            userName: 'org0and1Member'
                        })
                    })
                ]));
            });
    });
});
