import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedProduct, getMockedAuthBearerForUser, getMockedAuthBearerForProductMembership, getMockedAuthBearerSystemAdmin, getMockedFeature, getMockedFeatures } from '../../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';

configure('ERROR');

describe('DELETE /orgs/<orgId>/products/<productId>/features/<featureId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: 'CONTRIBUTOR'
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/abc`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/12345`) // a ridiculous id that should never exist in the mocked data
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        const features = await getMockedFeatures(product);
        const featuresCount = features.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async () => {
                const newFeatures = await getMockedFeatures(product);
                const newFeaturesCount = newFeatures.length;
                expect(newFeaturesCount).toBe(featuresCount - 1);
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const featureToDelete = await getMockedFeature(product);
        const features = await getMockedFeatures(product);
        const featuresCount = features.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${featureToDelete.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: 'OWNER'
            }))
            .expect(200)
            .then(async () => {
                const newFeatures = await getMockedFeatures(product);
                const newFeaturesCount = newFeatures.length;
                expect(newFeaturesCount).toBe(featuresCount - 1);
            });
    });
});
