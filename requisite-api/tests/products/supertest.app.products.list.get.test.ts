import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { getAuthBearer, getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedProduct, getMockedUser } from '../mockUtils';
import { ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('GET /orgs/<orgId>/products', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership())
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with all product data if a valid auth header is present for a system admin', async () => {
        const org = await getMockedOrg();
        const product1 = await getMockedProduct({ organization: org });
        const product2 = await getMockedProduct({ organization: org });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([product1, product2]));
            });
    });
    test('returns a 200 with membership specific product data for a product owner of a private product', async () => {
        const org = await getMockedOrg();
        const product = await getMockedProduct({ organization: org, public: false });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([product]);
            });
    });
    test('returns a 200 with membership specific product data for a product stakeholder of a private product', async () => {
        const org = await getMockedOrg();
        const product = await getMockedProduct({ organization: org, public: false });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.STAKEHOLDER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([product]);
            });
    });
    test('returns a 200 with membership specific product data for a product contributor of a private product', async () => {
        const org = await getMockedOrg();
        const product = await getMockedProduct({ organization: org, public: false });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual([product]);
            });
    });
    test('returns a 200 with membership specific product data for private products as well as any public product', async () => {
        const org = await getMockedOrg();
        const product1 = await getMockedProduct({ organization: org, public: false });
        const product2 = await getMockedProduct({ organization: org, public: true });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product1,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([product1, product2]));
            });
    });
    test('returns a 200 with membership specific product data for a product member with multiple private products', async () => {
        const org = await getMockedOrg();
        const product1 = await getMockedProduct({ organization: org, public: false });
        const product2 = await getMockedProduct({ organization: org, public: false });
        const user = await getMockedUser();
        await getMockedAuthBearerForProductMembership({
            user,
            entity: product1,
            role: ProductRole.CONTRIBUTOR
        });
        await getMockedAuthBearerForProductMembership({
            user,
            entity: product2,
            role: ProductRole.CONTRIBUTOR
        });
        return request(getApp())
            .get(`/orgs/${org.id}/products`)
            .set('Authorization', getAuthBearer(user))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([product1, product2]));
            });
    });
});
