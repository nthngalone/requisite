import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedProduct, getMockedProductMemberships, getMockedUser, getMockedUserForProductMembership, getMockedUserForSystemAdmin } from '../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('POST /org/<orgId>/products/<productId>/memberships', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productMember = await getMockedUserForProductMembership({ entity: product, role: 'CONTRIBUTOR' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productMember.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a user for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({ user: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only an entity for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({ entity: { id: 0 } })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a role for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({ role: 'OWNER' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a user and a role for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({
                user: { id: 0 },
                role: 'OWNER'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a entity and a role for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({
                entity: { id: 0 },
                role: 'OWNER'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a user and an entity for a product membership', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({
                user: { id: 0 },
                entity: { id: 0 }
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productMemberships = await getMockedProductMemberships();
        const productMembershipsCount = productMemberships.length;
        const nonMember = await getMockedUserForProductMembership(
            { entity: product },
            false
        );
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({
                user: nonMember,
                entity: product,
                role: 'CONTRIBUTOR'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({
                        id: nonMember.id,
                        userName: nonMember.userName
                    }),
                    entity: expect.objectContaining({
                        id: product.id,
                        name: product.name
                    }),
                    role: 'CONTRIBUTOR'
                });
                const updatedProductMemberships = await getMockedProductMemberships();
                expect(updatedProductMemberships.length).toBe(productMembershipsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        const nonMember = await getMockedUserForProductMembership(
            { entity: product },
            false
        );
        const productMemberships = await getMockedProductMemberships();
        const productMembershipsCount = productMemberships.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .send({
                user: nonMember,
                entity: product,
                role: 'OWNER'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual({
                    id: expect.any(Number),
                    user: expect.objectContaining({
                        id: nonMember.id,
                        userName: nonMember.userName
                    }),
                    entity: expect.objectContaining({
                        id: product.id,
                        name: product.name
                    }),
                    role: 'OWNER'
                });
                const updatedProductMemberships = await getMockedProductMemberships();
                expect(updatedProductMemberships.length).toBe(productMembershipsCount+1);
            });
    });
});
