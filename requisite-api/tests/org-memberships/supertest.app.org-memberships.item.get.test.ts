import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('GET /orgs/<orgId>/memberships/<orgMembershipId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for an org owner or member', async () => {
        return request(getApp())
            .get('/orgs/1/memberships/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/abc')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/123')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual(expect.objectContaining({
                    id: 0,
                    entity: expect.objectContaining({
                        id: 0
                    }),
                    user: expect.objectContaining({
                        userName: 'org0Owner'
                    })
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a org owner', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual(expect.objectContaining({
                    id: 0,
                    entity: expect.objectContaining({
                        id: 0
                    }),
                    user: expect.objectContaining({
                        userName: 'org0Owner'
                    })
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a org member', async () => {
        return request(getApp())
            .get('/orgs/0/memberships/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual(expect.objectContaining({
                    id: 0,
                    entity: expect.objectContaining({
                        id: 0
                    }),
                    user: expect.objectContaining({
                        userName: 'org0Owner'
                    })
                }));
            });
    });
});
