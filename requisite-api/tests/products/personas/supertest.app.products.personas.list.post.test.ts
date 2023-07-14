import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Product from '@requisite/model/lib/product/Product';
import { getMockedAuthBearerForProductMembership, getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedPersonas, getMockedProduct } from '../../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership, { ProductRole } from '@requisite/model/lib/user/Membership';

configure('ERROR');

describe('POST /org/<orgId>/products/<productId>/personas', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Forbidden response when an auth header for a non product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response with 3 errors when the request body is empty for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only a name for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({ name: 'SuperAwesomeUser' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only an description for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({ description: 'This is a super awesome user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 2 errors when the request body has only an avatar for a for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({ avatar: 'fa-solid fa-user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a name and a description for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: 'SuperAwesomeUser',
                description: 'This is a super awesome user'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a name and an avatar for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: 'SuperAwesomeUser',
                avatar: 'fa-solid fa-user'
            })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response with 1 error when the request body has only a description and an avatar for a valid user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                description: 'This is a super awesome user',
                avatar: 'fa-solid fa-user'
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
        const personas = await getMockedPersonas(product);
        const personasCount = personas.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({
                name: 'SuperAwesomeUser',
                description: 'This is a super awesome user',
                avatar: 'fa-solid fa-user'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    name: 'SuperAwesomeUser',
                    description: 'This is a super awesome user',
                    avatar: 'fa-solid fa-user'
                }));
                const updatedPersonas = await getMockedPersonas(product);
                expect(updatedPersonas.length).toBe(personasCount+1);
            });
    });
    test('returns a 200 with the new record when the request body is valid for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personas = await getMockedPersonas(product);
        const personasCount = personas.length;
        return request(getApp())
            .post(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .send({
                name: 'SuperAwesomeUser',
                description: 'This is a super awesome user',
                avatar: 'fa-solid fa-user'
            })
            .expect(200)
            .then(async (res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    name: 'SuperAwesomeUser',
                    description: 'This is a super awesome user',
                    avatar: 'fa-solid fa-user'
                }));
                const updatedPersonas = await getMockedPersonas(product);
                expect(updatedPersonas.length).toBe(personasCount+1);
            });
    });
});
