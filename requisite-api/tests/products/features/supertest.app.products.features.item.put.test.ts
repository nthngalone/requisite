import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import { getMockedProduct, getMockedAuthBearerForUser, getMockedAuthBearerForProductMembership, getMockedAuthBearerSystemAdmin, getMockedFeature } from '../../mockUtils';
import Persona from '@requisite/model/lib/product/Persona';
import Feature from '@requisite/model/lib/product/Feature';
import { ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>/features/<featureId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/abc`)
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
            .put(`/orgs/${org.id}/products/${product.id}/features/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but an empty object in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({ name: 'SuperAwesomeFeature' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a description in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({ description: 'This is a super awesome feature' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different feature id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: feature.id + 1,
                name: feature.name,
                description: feature.description
            })
            .expect(409);
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different product id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: feature.id,
                product: { id: product.id + 1 },
                name: feature.name,
                description: feature.description
            })
            .expect(409);
    });
    test('returns a 200 with data when a valid auth header and data is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                name: feature.name + '-updated',
                description: feature.description + '-updated'
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Feature;
                expect(result).toEqual(expect.objectContaining({
                    name: feature.name + '-updated',
                    description: feature.description + '-updated'
                }));
            });
    });
    test('returns a 200 with data when a valid auth header and data is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const feature = await getMockedFeature(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/features/${feature.id}`)
            .send({
                name: feature.name + '-updated',
                description: feature.description + '-updated'
            })
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const result = res.body as Persona;
                expect(result).toEqual(expect.objectContaining({
                    name: feature.name + '-updated',
                    description: feature.description + '-updated'
                }));
            });
    });
});
