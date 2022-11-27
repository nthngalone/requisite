import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedUsers } from '../mockUtils';

configure('OFF');

describe('DELETE /users/:userId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .delete('/users/0')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .delete('/users/0')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .delete('/users/0')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .delete('/users/0')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 400 Bad Request response when an invalid user id is provided on the path', async () => {
        return request(getApp())
            .delete('/users/abc')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown user id is provided on the path', async () => {
        return request(getApp())
            .delete('/users/123')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(404, 'Not Found');
    });
    test('returns a 200 response when a valid user id is provided on the path', async () => {
        const users = await getMockedUsers();
        const usersCount = users.length;
        return request(getApp())
            .delete('/users/0')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then(async () => {
                const newUsers = await getMockedUsers();
                expect(newUsers.length).toBe(usersCount - 1);
            });
    });
});
