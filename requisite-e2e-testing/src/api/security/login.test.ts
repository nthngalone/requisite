/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient } from '../ClientUtils';
import { createTestUser, afterAllDeleteCreatedUsers } from '../../TestUtils';

describe('/security/login', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('POST with no credentials returns a 400 response', async () => {
        const { status, data } = await getClient().post('/security/login');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.domain': { failed: { required: true } },
                'body.userName': { failed: { required: true } },
                'body.password': { failed: { required: true } }
            }
        }));
    });
    test('POST with no userName returns a 400 response', async () => {
        const { status, data } = await getClient().post('/security/login', {
            password: 'secret'
        });
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.domain': { failed: { required: true } },
                'body.userName': { failed: { required: true } }
            }
        }));
    });
    test('POST with no password returns a 400 response', async () => {
        const { status, data } = await getClient().post('/security/login', {
            userName: 'user1'
        });
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.domain': { failed: { required: true } },
                'body.password': { failed: { required: true } }
            }
        }));
    });
    test('POST with invalid domain returns a 401 response', async () => {
        const user = await createTestUser();
        const { domain, userName, password } = user as any;
        const { status, data } = await getClient().post('/security/login', {
            domain: `invalid-${domain}`,
            userName,
            password
        });
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('POST with invalid userName returns a 401 response', async () => {
        const { status, data } = await getClient().post('/security/login', {
            domain: 'local',
            userName: 'invalid',
            password: 'secret'
        });
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('POST with invalid password returns a 401 response', async () => {
        const user = await createTestUser();
        const { domain, userName, password } = user as any;
        const { status, data } = await getClient().post('/security/login', {
            domain,
            userName,
            password: `invalid-${password}`
        });
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('POST with system admin credentials returns a 200 response with a token', async () => {
        const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;
        const { status, headers, data } = await getClient().post('/security/login', {
            domain: SYSADMIN_DOMAIN,
            userName: SYSADMIN_USERNAME,
            password: SYSADMIN_PASSWORD
        });
        expect(status).toBe(200);
        const token = headers['x-authorization'];
        expect(data).toEqual(expect.objectContaining({
            message: 'Authenticated'
        }));
        expect(token).not.toBeUndefined();
        expect(token).not.toBeNull();
        expect(token.length).toBeGreaterThan(0);
    });
});
