import '../supertest.mock.bcryptjs';
import '../supertest.mock.jsonwebtoken';
import '../supertest.mock.sqlz';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';

configure('OFF');

describe('POST /security/register', () => {
    test('returns a 400 Bad Request response with 5 errors when the request body is empty', async () => {
        return request(getApp())
            .post('/security/register')
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(5);
            });
    });
    test('returns a 400 Bad Request response with 4 errors when the request body only has userName', async () => {
        return request(getApp())
            .post('/security/register')
            .send({ userName: 'user-name' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(4);
            });
    });
    test('returns a 409 Conflict response when trying to register with an existing user name and domain', async () => {
        return request(getApp())
            .post('/security/register')
            .send({
                domain: 'local',
                userName: 'sysadmin',
                password: 'pass',
                name: {
                    firstName: 'First',
                    lastName: 'Last'
                },
                emailAddress: 'somethingelse@address.com',
                termsAgreement: true
            })
            .expect(409);
    });
    test('returns a 409 Conflict response when trying to register with an existing email address', async () => {
        return request(getApp())
            .post('/security/register')
            .send({
                domain: 'local',
                userName: 'somethingelse',
                password: 'pass',
                name: {
                    firstName: 'First',
                    lastName: 'Last'
                },
                emailAddress: 'sysadmin@requisite.dev',
                termsAgreement: true
            })
            .expect(409);
    });
    test('returns a 200 Successful response when a valid request body is sent', async () => {
        const userName = 'new-user-name';
        return request(getApp())
            .post('/security/register')
            .send({
                domain: 'local',
                userName,
                password: 'password',
                name: {
                    firstName: 'first-name',
                    lastName: 'last-name'
                },
                emailAddress: 'new-email@address.com',
                termsAgreement: true
            })
            .expect(200)
            .expect('X-Authorization', `im-a-signed-token-for-local-${userName}`)
            .then((res) => {
                const results = res.body as RegistrationResponse;
                expect(results).toEqual(expect.objectContaining({
                    id: expect.any(Number),
                    message: 'Registered'
                }));
            });
    });
});
