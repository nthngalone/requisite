import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner, stakeholder, or contributor of a private product', async () => {
        return request(getApp())
            .get('/orgs/1/products/3')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Contributor')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        return request(getApp())
            .get('/orgs/0/products/abc')
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
            .get('/orgs/0/products/123')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private',
                    description: 'Org-0-Product-0-Private',
                    public: false
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner for a private product', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private',
                    description: 'Org-0-Product-0-Private',
                    public: false
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product stakeholder for a private product', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Stakeholder')
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private',
                    description: 'Org-0-Product-0-Private',
                    public: false
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product contributor for a private product', async () => {
        return request(getApp())
            .get('/orgs/0/products/0')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Contributor')
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 0,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-0-Private',
                    description: 'Org-0-Product-0-Private',
                    public: false
                });
            });
    });
    test('returns a 200 with data when a valid auth header is present for an org member for a public product', async () => {
        return request(getApp())
            .get('/orgs/0/products/1')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: 1,
                    organization: expect.objectContaining({
                        id: 0,
                        name: 'Organization 0'
                    }),
                    name: 'Org-0-Product-1-Public',
                    description: 'Org-0-Product-1-Public',
                    public: true
                });
            });
    });
});
