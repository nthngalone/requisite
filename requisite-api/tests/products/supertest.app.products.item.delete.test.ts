import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedProduct } from '../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';
import { OrganizationRole, ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('DELETE /orgs/<orgId>/products/<productId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner of a private product', async () => {
        const product = await getMockedProduct({ public: false });
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
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
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .delete(`/orgs/${org.id}/products/abc`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
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
            .delete(`/orgs/${org.id}/products/12345`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .expect(404, 'Not Found');
    });
    test('returns a 200 with the new record when the request body is valid by a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200);
    });
    test('returns a 200 with the new record when the request body is valid by a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200);
    });
});
