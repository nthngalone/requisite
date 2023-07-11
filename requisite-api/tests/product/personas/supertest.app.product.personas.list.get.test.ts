import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import Organization from '@requisite/model/lib/org/Organization';
import { getMockedProduct, getMockedPersonas, getMockedUser, getMockedUserForProductMembership, getMockedUserForSystemAdmin } from '../../mockUtils';
import Persona from '@requisite/model/lib/product/Persona';

configure('ERROR');

describe('GET /orgs/<orgId>/products/<productId>/personas', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present for a user of a different product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const nonMemb = await getMockedUserForProductMembership(
            { entity: product },
            false
        );
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', `Bearer valid|local|${nonMemb.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 200 with membership data if a valid auth header is present for a system admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const sysAdmin = await getMockedUserForSystemAdmin();
        const personas = await getMockedPersonas(product);
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === personas.length);
                expect(
                    results.every((persona) => persona.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    personas.map(persona => expect.objectContaining({
                        id: persona.id,
                        name: persona.name,
                        product: expect.objectContaining({
                            id: product.id
                        }),
                        description: persona.description,
                        avatar: persona.avatar
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for an owner of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personas = await getMockedPersonas(product);
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === personas.length);
                expect(
                    results.every((persona) => persona.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    personas.map(persona => expect.objectContaining({
                        id: persona.id,
                        name: persona.name,
                        product: expect.objectContaining({
                            id: product.id
                        }),
                        description: persona.description,
                        avatar: persona.avatar
                    }))
                ));
            });
    });
    test('returns a 200 with membership data if a valid auth header is present for a member of a product', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personas = await getMockedPersonas(product);
        const productMember = await getMockedUserForProductMembership({ entity: product, role: 'CONTRIBUTOR' });
        return request(getApp())
            .get(`/orgs/${org.id}/products/${product.id}/personas`)
            .set('Authorization', `Bearer valid|local|${productMember.userName}`)
            .expect(200)
            .then((res) => {
                const results = res.body as Persona[];
                expect(results.length === personas.length);
                expect(
                    results.every((persona) => persona.product.id === product.id)
                ).toBeTruthy();
                expect(results).toEqual(expect.arrayContaining(
                    personas.map(persona => expect.objectContaining({
                        id: persona.id,
                        name: persona.name,
                        product: expect.objectContaining({
                            id: product.id
                        }),
                        description: persona.description,
                        avatar: persona.avatar
                    }))
                ));
            });
    });
});
