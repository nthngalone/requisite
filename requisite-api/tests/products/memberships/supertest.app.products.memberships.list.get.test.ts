import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import Membership, { ProductRole } from '@requisite/model/lib/user/Membership';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedProduct, getMockedProductMemberships } from '../../mockUtils';
import Product from '@requisite/model/lib/product/Product';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/memberships', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org // org member but not a product member
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with membership data if a valid auth header is present for a system admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productMemberships = await getMockedProductMemberships({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Product>[];
                expect(results.length === productMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    productMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for an owner of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productMemberships = await getMockedProductMemberships({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Product>[];
                expect(results.length === productMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    productMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for a member of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const productMemberships = await getMockedProductMemberships({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const results = res.body as Membership<Product>[];
                expect(results.length === productMemberships.length);
                expect(
                    results.every((membership) => membership.entity.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    productMemberships.map(membership => expect.objectContaining({
                        id: membership.id,
                        user: expect.objectContaining({
                            id: membership.user.id,
                            userName: membership.user.userName
                        }),
                        entity: expect.objectContaining({
                            id: membership.entity.id
                        }),
                        role: membership.role
                    }))
                ));
            });
    });
});
