import '../supertest.mock.bcryptjs';
import '../supertest.mock.jsonwebtoken';
import '../supertest.mock.sqlz';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import { getMockedUser } from '../mockUtils';

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
        const user = await getMockedUser();
        return request(getApp())
            .post('/security/register')
            .send({
                domain: user.domain,
                userName: user.userName,
                password: 'pass',
                name: user.name,
                emailAddress: 'somethingelse@address.com',
                termsAgreement: true
            })
            .expect(409);
    });
    test('returns a 409 Conflict response when trying to register with an existing email address', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .post('/security/register')
            .send({
                domain: user.domain,
                userName: 'somethingelse',
                password: 'pass',
                name: user.name,
                emailAddress: user.emailAddress,
                termsAgreement: true
            })
            .expect(409);
    });
    test('returns a 200 Successful response when a valid request body is sent', async () => {
        const userName = 'registration-test-user';
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
                emailAddress: 'registration-test-user@address.com',
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
