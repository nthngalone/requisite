import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedFeature, getMockedStories } from '../mockUtils';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';
import Story from '@requisite/model/lib/story/Story';

configure('ERROR');

describe('POST /orgs/<orgId>/products/<productId>/features/<featureId>/stories', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non product member', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership())
            .expect(403, 'Not Authorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non product member owner', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 2 errors when there is no request body for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body is empty for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body only has a title for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: 'I only have a title'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body only has a description for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                description: 'I only have a description'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body only has an invalid title for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: 123,
                description: 'Story with an invalid title'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body only has an invalid description for a valid user', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: 'Story with an invalid description',
                description: 123
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const stories = await getMockedStories(feature);
        const storiesCount = stories.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                title: 'New Story Created by a System Admin',
                description: 'This is a new story for testing purposes'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Story;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    title: 'New Story Created by a System Admin',
                    description: 'This is a new story for testing purposes',
                    feature
                }));
                const updatedStories = await getMockedStories(feature);
                expect(updatedStories.length).toBe(storiesCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a product owner', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const stories = await getMockedStories(feature);
        const storiesCount = stories.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                title: 'New Story Created by a Product Owner',
                description: 'This is a new story for testing purposes'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Story;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    title: 'New Story Created by a Product Owner',
                    description: 'This is a new story for testing purposes',
                    feature
                }));
                const updatedStories = await getMockedStories(feature);
                expect(updatedStories.length).toBe(storiesCount+1);
            });
    });
});
