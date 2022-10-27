import '../supertest.mock.bcryptjs';
import '../supertest.mock.jsonwebtoken';
import '../supertest.mock.sqlz';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { sign } from 'jsonwebtoken';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';

configure('OFF');

describe('GET /security/login', () => {
    test('returns a 404 Not Found response', async () => {
        return request(getApp())
            .get('/security/login')
            .expect(404, 'Not Found');
    });
});

describe('POST /security/login', () => {
    test('with empty body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('with empty JSON in body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({})
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('with only password in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ password: 'pass' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('with only username in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ userName: 'user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('with only domain in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('with only userName and domain in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', userName: 'user' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('with only password and domain in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', password: 'pass' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('with only userName and password in JSON body returns a 400 Bad Request response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ userName: 'user', password: 'pass' })
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('with invalid domain in JSON body returns a 401 Unauthorized response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'invalid', userName: 'sysadmin', password: 'pass' })
            .expect(401, 'Unauthorized');
    });
    test('with invalid user name in JSON body returns a 401 Unauthorized response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', userName: 'invalid', password: 'pass' })
            .expect(401, 'Unauthorized');
    });
    test('with invalid password in JSON body returns a 401 Unauthorized response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', userName: 'sysadmin', password: 'invalid' })
            .expect(401, 'Unauthorized');
    });
    test('with valid credentials in JSON body for a revoked account returns a 401 Unauthorized response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', userName: 'revoked', password: 'pass' })
            .expect(401, 'Unauthorized');
    });
    test('with valid credentials in JSON body returns a 200 Success response with a signed jwt auth token', async () => {
        const domain = 'local';
        const userName = 'sysadmin';
        const password = 'pass';
        return request(getApp())
            .post('/security/login')
            .send({ domain, userName, password })
            .expect(200, '{"message":"Authenticated"}')
            .expect('X-Authorization', `im-a-signed-token-for-local-${userName}`)
            .then(() => {
                expect(sign).toHaveBeenCalledWith(
                    { user: expect.objectContaining({ userName }) },
                    expect.any(String),
                    expect.any(Object)
                );
            });
    });
    test('that results in a system error returns a 500 System Error response', async () => {
        return request(getApp())
            .post('/security/login')
            .send({ domain: 'local', userName: 'error', password: 'error' })
            .expect(500);
    });
});
