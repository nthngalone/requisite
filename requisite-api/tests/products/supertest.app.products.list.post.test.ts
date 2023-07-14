import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedAuthBearerForOrgMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedOrg, getMockedProducts } from '../mockUtils';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('POST /org/<orgId>/products', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership())
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 error when the request body is empty for an org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 error when the request body has only a name for an org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({ name: 'Test Product' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a name and description for an org owner', async () => {
        const org = await getMockedOrg();
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({ name: 'Test Product', description: 'Test Product Description' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a system admin', async () => {
        const org = await getMockedOrg();
        const products = await getMockedProducts({ organization: org });
        const productsCount = products.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                name: 'New Product Created by a System Admin',
                description: 'Description for a New Product Created by a System Admin',
                public: true
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    name: 'New Product Created by a System Admin',
                    description: 'Description for a New Product Created by a System Admin',
                    public: true,
                    organization: org
                }));
                const updatedProducts = await getMockedProducts({ organization: org });
                expect(updatedProducts.length).toBe(productsCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for an org owner', async () => {
        const org = await getMockedOrg();
        const products = await getMockedProducts({ organization: org });
        const productsCount = products.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org,
                role: OrganizationRole.OWNER
            }))
            .send({
                name: 'New Product Created by an Org Owner',
                description: 'Description for a New Product Created by an Org Owner',
                public: true
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Product;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    name: 'New Product Created by an Org Owner',
                    description: 'Description for a New Product Created by an Org Owner',
                    public: true,
                    organization: org
                }));
                const updatedProducts = await getMockedProducts({ organization: org });
                expect(updatedProducts.length).toBe(productsCount+1);
            });
    });
});
