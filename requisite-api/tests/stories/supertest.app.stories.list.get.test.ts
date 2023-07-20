import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedFeature, getMockedStory } from '../mockUtils';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/features/<featureId>/stories', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership())
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with all story data if a valid auth header is present for a system admin', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const story1 = await getMockedStory(feature);
        const story2 = await getMockedStory(feature);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([story1, story2]));
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product owner', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const story1 = await getMockedStory(feature);
        const story2 = await getMockedStory(feature);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([story1, story2]));
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product contributor', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const story1 = await getMockedStory(feature);
        const story2 = await getMockedStory(feature);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([story1, story2]));
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product stakeholder', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const story1 = await getMockedStory(feature);
        const story2 = await getMockedStory(feature);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.STAKEHOLDER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(expect.arrayContaining([story1, story2]));
            });
    });
});
