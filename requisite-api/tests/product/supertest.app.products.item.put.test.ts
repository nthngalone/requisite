import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a private product', async () => {
        return request(getApp())
            .put('/orgs/1/products/3')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Contributor')
            .expect(403, 'Not Authorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a public product', async () => {
        return request(getApp())
            .put('/orgs/0/products/1')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        return request(getApp())
            .put('/orgs/0/products/abc')
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
            .put('/orgs/0/products/123')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only name in the body', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .send({ name: 'Org-0-Product-0-Private - Updated'})
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and description in the body', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .send({ name: 'Org-0-Product-0-Private - Updated', description: 'Org-0-Product-0-Private - Updated' })
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and public indicator in the body', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .send({ name: 'Org-0-Product-0-Private - Updated', public: true })
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a description and public indicator in the body', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .send({ description: 'Org-0-Product-0-Private - Updated', public: true })
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid by a product owner', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .send({ name: 'Org-0-Product-0-Private-Updated', description: 'Org-0-Product-0-Private-Updated', public: true })
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private-Updated',
                    description: 'Org-0-Product-0-Private-Updated',
                    public: true
                });
            });
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        return request(getApp())
            .put('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({ name: 'Org-0-Product-0-Private-Updated', description: 'Org-0-Product-0-Private-Updated', public: true })
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private-Updated',
                    description: 'Org-0-Product-0-Private-Updated',
                    public: true
                });
            });
    });
});
