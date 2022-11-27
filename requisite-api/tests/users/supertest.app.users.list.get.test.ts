import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import User from '@requisite/model/lib/user/User';
import { getMockedUsers } from '../mockUtils';

configure('OFF');

describe('GET /users', () => {

    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/users')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/users')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/users')
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/users')
            .set('Authorization', 'Bearer valid|local|revoked')
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 with user data if a valid auth header is present', async () => {
        const users = await getMockedUsers();
        return request(getApp())
            .get('/users')
            .set('Authorization', 'Bearer valid|local|sysadmin')
            .expect(200)
            .then((res) => {
                const results = res.body as User[];
                expect(results).toEqual(users);
            });
    });
});
