import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedSystemAdminMemberships, getMockedUser } from '../mockUtils';

configure('ERROR');

describe('POST /system/admins', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .post('/system/admins')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 400 Bad Request response when an valid auth header but no body', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
                expect(results.errors).toEqual(expect.objectContaining({ 'body.id': { failed: { required: true } } }));
            });
    });
    test('returns a 400 Bad Request response when an valid auth header but an empty body', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
                expect(results.errors).toEqual(expect.objectContaining({ 'body.id': { failed: { required: true } } }));
            });
    });
    test('returns a 200 response when an valid auth header and valid body are sent', async () => {
        const requestorBearer = await getMockedAuthBearerSystemAdmin();
        const initialAdminCount = (await getMockedSystemAdminMemberships()).length;
        const user = await getMockedUser();

        return request(getApp())
            .post('/system/admins')
            .set('Authorization', requestorBearer)
            .send({ id: user.id })
            .expect(200)
            .then(async (res) => {
                const results = res.body as SystemAdmin;
                expect(results.id).toBeGreaterThanOrEqual(0);
                expect(results.user.id).toBe(user.id);
                const updatedAdmins = await getMockedSystemAdminMemberships();
                const updatedAdminCount = updatedAdmins.length;
                expect(updatedAdminCount).toEqual(initialAdminCount + 1);
                expect(updatedAdmins.find(admin => admin.id === results.id)).toBeTruthy();
            });
    });
});
