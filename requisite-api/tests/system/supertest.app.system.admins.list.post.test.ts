import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import SystemAdminsDataModel from '../../src/services/sqlz/data-models/SystemAdminsDataModel';
import { getSequelize } from '../../src/services/sqlz/SqlzUtils';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';

configure('ERROR');

async function getMockedSystemAdmins(): Promise<SystemAdmin[]> {
    SystemAdminsDataModel.initialize(await getSequelize());
    return (await SystemAdminsDataModel.findAll()).map(
        o => SystemAdminsDataModel.toSystemAdmin(o)
    );
}

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
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 400 Bad Request response when an valid auth header but no body', async () => {
        return request(getApp())
            .post('/system/admins')
            .set('Authorization', 'Bearer valid|local|sysadmin')
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
            .set('Authorization', 'Bearer valid|local|sysadmin')
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
        const initialAdminCount = (await getMockedSystemAdmins()).length;
        const app = getApp();

        // First create a new user to make an admin
        let newUserId = -1;
        await request(getApp())
            .post('/security/register')
            .send({
                userName: 'sysAdminAddTest',
                password: 'password',
                name: {
                    firstName: 'System',
                    lastName: 'Admin'
                },
                emailAddress: 'sysAdminAddTest@requisite.dev',
                termsAgreement: true
            })
            .then((res) => {
                const { id } = res.body as RegistrationResponse;
                newUserId = id as number;
            });

        // Then assign that user as an admin
        return request(app)
            .post('/system/admins')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .send({ id: newUserId })
            .expect(200)
            .then(async (res) => {
                const results = res.body as SystemAdmin;
                expect(results.id).toBeGreaterThanOrEqual(0);
                expect(results.user.id).toBe(newUserId);
                const updatedAdmins = await getMockedSystemAdmins();
                const updatedAdminCount = updatedAdmins.length;
                expect(updatedAdminCount).toEqual(initialAdminCount + 1);
                expect(updatedAdmins.find(admin => admin.id === results.id)).toBeTruthy();
            });
    });
});
