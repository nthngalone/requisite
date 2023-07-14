import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import User from '@requisite/model/lib/user/User';
import { getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedUsers } from '../mockUtils';

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
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/users')
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 with user data if a valid auth header is present', async () => {
        return request(getApp())
            .get('/users')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async (res) => {
                const results = res.body as User[];
                const users = await getMockedUsers();
                expect(results).toEqual(users);
            });
    });
});
