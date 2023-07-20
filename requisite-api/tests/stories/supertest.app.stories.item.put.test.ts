import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import { getMockedAuthBearerForUser, getMockedAuthBearerForProductMembership, getMockedAuthBearerSystemAdmin, getMockedFeature } from '../mockUtils';
import Feature from '@requisite/model/lib/product/Feature';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import { getMockedStory } from '../mockUtils';
import Product from '@requisite/model/lib/product/Product';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>/features/<featureId>/stories/<storyId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/abc`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but an empty object in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a title in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: story.title + '-updated'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a description in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                description: story.description + '-updated'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource with an invalid title in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: 123,
                description: story.description + '-updated'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource with an invalid description in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: story.title + '-updated',
                description: 123
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different story id in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: story.id + 1,
                title: story.title,
                description: story.description
            })
            .expect(409);
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different feature id in the body', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: story.id,
                feature: { id: feature.id + 1 },
                title: story.title,
                description: story.description
            })
            .expect(409);
    });
    test('returns a 200 with data when a valid auth header and data is present for a sys admin', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: story.title + '-updated',
                description: story.description + '-updated'
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Feature;
                expect(result).toEqual(expect.objectContaining({
                    title: story.title + '-updated',
                    description: story.description + '-updated'
                }));
            });
    });
    test('returns a 200 with data when a valid auth header and data is present for a product owner', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                title: story.title + '-updated',
                description: story.description + '-updated'
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Feature;
                expect(result).toEqual(expect.objectContaining({
                    title: story.title + '-updated',
                    description: story.description + '-updated'
                }));
            });
    });
});
