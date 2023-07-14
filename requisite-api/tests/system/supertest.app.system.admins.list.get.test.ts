import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';
import { getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedSystemAdminMemberships } from '../mockUtils';

configure('ERROR');

describe('GET /system/admins', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        return request(getApp())
            .get('/system/admins')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        return request(getApp())
            .get('/system/admins')
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        return request(getApp())
            .get('/system/admins')
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        return request(getApp())
            .get('/system/admins')
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 200 with user data if a valid auth header is present', async () => {
        return request(getApp())
            .get('/system/admins')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async (res) => {
                const admins = await getMockedSystemAdminMemberships();
                const results = res.body as SystemAdmin[];
                expect(results.length).toEqual(admins.length);
                expect(results).toEqual(admins);
            });
    });
});
