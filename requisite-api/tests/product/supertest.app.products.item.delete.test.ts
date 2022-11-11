import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

configure('ERROR');

describe('DELETE /orgs/<orgId>/products/<productId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .delete('/orgs/0/products/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .delete('/orgs/0/products/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .delete('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .delete('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a private product', async () => {
        return request(getApp())
            .delete('/orgs/1/products/3')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Contributor')
            .expect(403, 'Not Authorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a public product', async () => {
        return request(getApp())
            .delete('/orgs/0/products/1')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        return request(getApp())
            .delete('/orgs/0/products/abc')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        return request(getApp())
            .delete('/orgs/0/products/123')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(404, 'Not Found');
    });
    test('returns a 200 with the new record when the request body is valid by a product owner', async () => {
        return request(getApp())
            .delete('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(200);
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        return request(getApp())
            .delete('/orgs/0/products/1')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200);
    });
});
