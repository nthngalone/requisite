import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

configure('ERROR');

describe('PUT /orgs/:orgId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .put('/orgs/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response for a non org owner or sysadmin', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 1 error when the request body is empty', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
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
            .put('/orgs/123')
            .send({ name: 'Organization 123 - Updated'})
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(404, 'Not Found');
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({ name: 'Organization 0 - Updated by sysadmin'})
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: 0,
                    name: 'Organization 0 - Updated by sysadmin'
                });
            });
    });
    test('returns a 200 with the new record when the request body is valid by a org owner', async () => {
        return request(getApp())
            .put('/orgs/0')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ name: 'Organization 0 - Updated by org0Owner'})
            .expect(200)
            .then((res) => {
                const result = res.body as Organization;
                expect(result).toEqual({
                    id: 0,
                    name: 'Organization 0 - Updated by org0Owner'
                });
            });
    });
});
