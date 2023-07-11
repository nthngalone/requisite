import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedProduct, getMockedPersona, getMockedPersonas, getMockedUser, getMockedUserForProductMembership, getMockedUserForSystemAdmin } from '../../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';

configure('ERROR');

describe('DELETE /orgs/<orgId>/products/<productId>/personas/<personaId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        const productMember = await getMockedUserForProductMembership({ entity: product, role: 'CONTRIBUTOR' });
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', `Bearer valid|local|${productMember.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/abc`)
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
            .delete(`/orgs/${org.id}/products/${product.id}/personas/12345`) // a ridiculous id that should never exist in the mocked data
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(404, 'Not Found');
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const sysAdmin = await getMockedUserForSystemAdmin();
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        const personas = await getMockedPersonas(product);
        const personasCount = personas.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(200)
            .then(async () => {
                const newPersonas = await getMockedPersonas(product);
                const newPersonasCount = newPersonas.length;
                expect(newPersonasCount).toBe(personasCount - 1);
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const personaToDelete = await getMockedPersona(product);
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        const personas = await getMockedPersonas(product);
        const personasCount = personas.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/personas/${personaToDelete.id}`)
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .expect(200)
            .then(async () => {
                const newPersonas = await getMockedPersonas(product);
                const newPersonasCount = newPersonas.length;
                expect(newPersonasCount).toBe(personasCount - 1);
            });
    });
});
