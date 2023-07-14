import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import Product from '@requisite/model/lib/product/Product';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedProduct } from '../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';
import { ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a private product', async () => {
        const product = await getMockedProduct({ public: false });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a public product', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}/products/abc`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({ entity: org }))
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .put(`/orgs/${org.id}/products/12345`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({ entity: org }))
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only name in the body', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({ name: product.name + ' - Updated' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and description in the body', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: product.name + ' - Updated',
                description: product.description + ' - Updated'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and public indicator in the body', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: product.name + ' - Updated',
                public: !product.public
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a description and public indicator in the body', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                description: product.description + ' - Updated',
                public: !product.public
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid by a product owner', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: product.name + ' - Updated',
                description: product.description + ' - Updated',
                public: !product.public
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: product.id,
                    organization: expect.objectContaining({
                        id: org.id,
                        name: org.name
                    }),
                    name: product.name + ' - Updated',
                    description: product.description + ' - Updated',
                    public: !product.public
                });
            });
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        const product = await getMockedProduct({ public: true });
        const org = product.organization as Organization;
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                name: product.name + ' - Updated',
                description: product.description + ' - Updated',
                public: !product.public
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Product;
                expect(result).toEqual({
                    id: product.id,
                    organization: expect.objectContaining({
                        id: org.id,
                        name: org.name
                    }),
                    name: product.name + ' - Updated',
                    description: product.description + ' - Updated',
                    public: !product.public
                });
            });
    });
});
