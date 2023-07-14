import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForUser, getMockedAuthBearerSystemAdmin, getMockedUser, getMockedUsers } from '../mockUtils';

configure('OFF');

describe('DELETE /users/:userId', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .delete(`/users/${user.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .delete(`/users/${user.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .delete(`/users/${user.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .delete(`/users/${user.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized response when a valid auth header is present but is not a system admin', async () => {
        const user = await getMockedUser();
        return request(getApp())
            .delete(`/users/${user.id}`)
            .set('Authorization', await getMockedAuthBearerForUser())
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid user id is provided on the path', async () => {
        return request(getApp())
            .delete('/users/abc')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown user id is provided on the path', async () => {
        return request(getApp())
            .delete('/users/12345')
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 200 response when a valid user id is provided on the path and the requestor is a system admin', async () => {
        const user = await getMockedUser();
        const requestorAuthBearer = await getMockedAuthBearerSystemAdmin();
        const users = await getMockedUsers();
        const usersCount = users.length; // get count after creating mock resources
        return request(getApp())
            .delete(`/users/${user.id}`)
            .set('Authorization', requestorAuthBearer)
            .expect(200)
            .then(async () => {
                const newUsers = await getMockedUsers();
                expect(newUsers.length).toBe(usersCount - 1);
            });
    });
});
