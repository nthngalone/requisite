import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedFeature, getMockedStory } from '../mockUtils';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';
import Feature from '@requisite/model/lib/product/Feature';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/features/<featureId>/stories/<storyId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different org', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership())
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request when an invalid index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/abc`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400);
    });
    test('returns a 404 Not Found when an unknown index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 404 Not Found when a valid index but not for the correct feature', async () => {
        const story = await getMockedStory();
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with all story data if a valid auth header is present for a system admin', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(story);
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product owner', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(story);
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product contributor', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(story);
            });
    });
    test('returns a 200 with all story data if a valid auth header is present for a product stakeholder', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.STAKEHOLDER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Product[];
                expect(results).toEqual(story);
            });
    });
});
