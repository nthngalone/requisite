import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership, { OrganizationRole, ProductRole } from '@requisite/model/lib/user/Membership';
import { getMockedProduct, getMockedProductMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerSystemAdmin, getMockedAuthBearerForUser } from '../mockUtils';
import Product from '@requisite/model/lib/product/Product';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>/memberships/<productMembershipId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
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
            .put(`/orgs/${org.id}/products/${product.id}/memberships/abc`)
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
            .put(`/orgs/${org.id}/products/${product.id}/memberships/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ user: { id: 0 }})
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only an entity in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ entity: { id: 0 } })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a role in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ role: 'OWNER' })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user and entity in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ user: { id: 1 }, entity: { id: 0 } })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user and role in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ user: { id: 1 }, role: 'OWNER' })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only an entity and role in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({ entity: { id: 0 }, role: 'OWNER' })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different membership id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: membership.id + 1,
                user: membership.user,
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .expect(409);
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different entity id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: membership.id,
                user: membership.user,
                entity: { id: membership.entity.id + 1 },
                role: OrganizationRole.OWNER
            })
            .expect(409);
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different user id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                id: membership.id,
                user: { id: membership.user.id + 1 },
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .expect(409);
    });
    test('returns a 200 with data when a valid auth header and data is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({
                user: membership.user,
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        id: membership.user.id
                    }),
                    role: 'OWNER'
                }));
            });
    });
    test('returns a 200 with data when a valid auth header and data is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .send({
                user: membership.user,
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        id: membership.user.id
                    }),
                    role: 'OWNER'
                }));
            });
    });
});
