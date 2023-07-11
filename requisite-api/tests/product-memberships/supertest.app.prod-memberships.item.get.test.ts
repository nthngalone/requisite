import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';
import { getMockedUserForSystemAdmin, getMockedUser, getMockedProductMembership, getMockedProduct, getMockedUserForProductMembership } from '../mockUtils';
import Product from '@requisite/model/lib/product/Product';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/memberships/<productMembershipId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner or member', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        const nonMemb = await getMockedUserForProductMembership(
            { entity: product },
            false
        );
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${nonMemb.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/abc`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
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
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/12345`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        userName: membership.user.userName
                    }),
                    role: membership.role
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        userName: membership.user.userName
                    }),
                    role: membership.role
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product member', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const membership = await getMockedProductMembership({ entity: product });
        const productMember = await getMockedUserForProductMembership({ entity: product, role: 'CONTRIBUTOR' });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${productMember.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        userName: membership.user.userName
                    }),
                    role: membership.role
                }));
            });
    });
});