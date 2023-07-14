import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership, { ProductRole } from '@requisite/model/lib/user/Membership';
import { getMockedProduct, getMockedPersona, getMockedAuthBearerForUser, getMockedAuthBearerForOrgMembership, getMockedAuthBearerSystemAdmin, getMockedAuthBearerForProductMembership } from '../../mockUtils';
import Product from '@requisite/model/lib/product/Product';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/personas/<personaId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner or member', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerForOrgMembership({
                entity: org // member or the org but not of the product
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/abc`)
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
            .get(`/orgs/${org.id}/products/${product.id}/personas/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: persona.id,
                    name: persona.name,
                    product: expect.objectContaining({
                        id: product.id
                    }),
                    description: persona.description,
                    avatar: persona.avatar
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.OWNER
            }))
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: persona.id,
                    name: persona.name,
                    product: expect.objectContaining({
                        id: product.id
                    }),
                    description: persona.description,
                    avatar: persona.avatar
                }));
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product member', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: ProductRole.CONTRIBUTOR
            }))
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Product>;
                expect(result).toEqual(expect.objectContaining({
                    id: persona.id,
                    name: persona.name,
                    product: expect.objectContaining({
                        id: product.id
                    }),
                    description: persona.description,
                    avatar: persona.avatar
                }));
            });
    });
});
