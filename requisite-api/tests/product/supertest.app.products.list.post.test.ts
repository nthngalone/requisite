import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedOrgs, getMockedProducts } from '../mockUtils';

configure('ERROR');

describe('POST /org/<orgId>/products', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non org owner', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for an org owner', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 error when the request body has only a name for an org owner', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ name: 'Test Product' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a name and description for an org owner', async () => {
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({ name: 'Test Product', description: 'Test Product Description' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const orgs = await getMockedOrgs();
        const products = await getMockedProducts();
        const productsCount = products.length;
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({
                name: 'Product Created by SysAdmin Test',
                description: 'Product Created by SysAdmin Test Description',
                public: true
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: expect.any(Number),
                    name: 'Product Created by SysAdmin Test',
                    description: 'Product Created by SysAdmin Test Description',
                    public: true,
                    organization: orgs[0]
                });
                const updatedProducts = await getMockedProducts();
                expect(updatedProducts.length).toBe(productsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for an org owner', async () => {
        const orgs = await getMockedOrgs();
        const products = await getMockedProducts();
        const productsCount = products.length;
        return request(getApp())
            .post('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0Owner')
            .send({
                name: 'Product Created by OrgOwner Test',
                description: 'Product Created by OrgOwner Test Description',
                public: false
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: expect.any(Number),
                    name: 'Product Created by OrgOwner Test',
                    description: 'Product Created by OrgOwner Test Description',
                    public: false,
                    organization: orgs[0]
                });
                const updatedProducts = await getMockedProducts();
                expect(updatedProducts.length).toBe(productsCount+1);
            });
    });
});
