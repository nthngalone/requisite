import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { getMockedProduct, getMockedAuthBearerForUser, getMockedAuthBearerForOrgMembership, getMockedAuthBearerSystemAdmin, getMockedAuthBearerForProductMembership, getMockedFeature } from '../../mockUtils';
import Persona from '@requisite/model/lib/product/Persona';
import { ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/features', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org // member of the org but not the product
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with membership data if a valid auth header is present for a system admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature1 = await getMockedFeature(product);
        const feature2 = await getMockedFeature(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === 2);
                expect(
                    results.every((feature) => feature.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    feature1,
                    feature2
                ]));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for an owner of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature1 = await getMockedFeature(product);
        const feature2 = await getMockedFeature(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === 2);
                expect(
                    results.every((feature) => feature.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    feature1,
                    feature2
                ]));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for a member of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature1 = await getMockedFeature(product);
        const feature2 = await getMockedFeature(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === 2);
                expect(
                    results.every((feature) => feature.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining([
                    feature1,
                    feature2
                ]));
            });
    });
});
