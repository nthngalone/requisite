import '../../supertest.mock.sqlz';
import '../../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../../src/app';
import { configure } from '../../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import { getMockedUserForSystemAdmin, getMockedUser, getMockedUserForProductMembership, getMockedProduct, getMockedPersona } from '../../mockUtils';
import Persona from '@requisite/model/lib/product/Persona';

configure('ERROR');

describe('PUT /orgs/<orgId>/products/<productId>/personas/<personaId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const productMember = await getMockedUserForProductMembership({ entity: product, role: 'CONTRIBUTOR' });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${productMember.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/abc`)
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
            .put(`/orgs/${org.id}/products/${product.id}/personas/12345`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({ name: 'SuperAwesomeUser' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a description in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({ description: 'This is a super awesome user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only an avatar in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({ avatar: 'fa-solid fa-user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and description in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
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
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a name and avatar in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .send({ user: { id: 1 }, role: 'OWNER' })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
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
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a descrition and avatar in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
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
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different persona id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({
                id: persona.id + 1,
                name: persona.name,
                description: persona.description,
                avatar: persona.avatar
            })
            .expect(409);
    });
    test('returns a 409 Conflict response for a valid auth header for the request resource but a different product id in the body', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({
                id: persona.id,
                product: { id: product.id+1 },
                name: persona.name,
                description: persona.description,
                avatar: persona.avatar
            })
            .expect(409);
    });
    test('returns a 200 with data when a valid auth header and data is present for a sys admin', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .send({
                name: persona.name + '-updated',
                description: persona.description + '-updated',
                avatar: persona.avatar + '-updated'
            })
            .expect(200)
            .then((res) => {
                const result = res.body as Persona;
                expect(result).toEqual(expect.objectContaining({
                    name: persona.name + '-updated',
                    description: persona.description + '-updated',
                    avatar: persona.avatar + '-updated'
                }));
            });
    });
    test('returns a 200 with data when a valid auth header and data is present for a product owner', async () => {
        const product = await getMockedProduct();
        const org = product.organization as Organization;
        const persona = await getMockedPersona(product);
        const productOwner = await getMockedUserForProductMembership({ entity: product, role: 'OWNER' });
        return request(getApp())
            .put(`/orgs/${org.id}/products/${product.id}/personas/${persona.id}`)
            .send({
                name: persona.name + '-updated',
                description: persona.description + '-updated',
                avatar: persona.avatar + '-updated'
            })
            .set('Authorization', `Bearer valid|local|${productOwner.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Persona;
                expect(result).toEqual(expect.objectContaining({
                    name: persona.name + '-updated',
                    description: persona.description + '-updated',
                    avatar: persona.avatar + '-updated'
                }));
            });
    });
});
