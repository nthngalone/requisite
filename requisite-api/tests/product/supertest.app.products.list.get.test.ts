import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { getMockedProducts } from '../mockUtils';

configure('ERROR');

describe('GET /orgs/<orgId>/products', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/products')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Owner')
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with all product data if a valid auth header is present for a system admin', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[0], products[1]]);
            });
    });
    test('returns a 200 with membership specific product data for a product owner of a private product', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/1/products')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Owner')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[2]]);
            });
    });
    test('returns a 200 with membership specific product data for a product stakeholder of a private product', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/1/products')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Stakeholder')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[2]]);
            });
    });
    test('returns a 200 with membership specific product data for a product contributor of a private product', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/1/products')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2Contributor')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[2]]);
            });
    });
    test('returns a 200 with membership specific product data for private products as well as any public product', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/0/products')
            .set('Authorization', 'Bearer valid|local|org0MemberProduct0Contributor')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[0], products[1]]);
            });
    });
    test('returns a 200 with membership specific product data for a product member with multiple private products', async () => {
        const products = await getMockedProducts();
        return request(getApp())
            .get('/orgs/1/products')
            .set('Authorization', 'Bearer valid|local|org1MemberProduct2and3Contributor')
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([products[2], products[3]]);
            });
    });
});
