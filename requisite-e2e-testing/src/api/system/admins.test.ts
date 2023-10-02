/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterAllDeleteCreatedUsers, createTestUser } from '../../TestUtils';
import { getClient, getSecuredClient, getSystemAdminUser } from '../ClientUtils';
import type User from '@requisite/model/lib/user/User';
import type SystemAdmin from '@requisite/model/lib/user/SystemAdmin';

describe('/system/admins', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('GET without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().get('/system/admins');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('GET with a valid system admin token returns a 200 response with at least the default sys admin', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD,
            SYSADMIN_EMAIL,
            SYSADMIN_FIRST_NAME,
            SYSADMIN_LAST_NAME
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { data } = await client.get('/system/admins');
        expect(data.length).toBeGreaterThan(0);
        expect(data).toEqual(
            expect.arrayContaining([expect.objectContaining({
                id: expect.any(Number),
                user: expect.objectContaining({
                    id: expect.any(Number),
                    userName: SYSADMIN_USERNAME,
                    emailAddress: SYSADMIN_EMAIL,
                    name: {
                        firstName: SYSADMIN_FIRST_NAME,
                        lastName: SYSADMIN_LAST_NAME
                    }
                }),
                role: 'ADMIN'
            })])
        );
    });
    test('POST without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().post('/system/admins');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('POST without a request body returns a 400 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.post('/system/admins');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.id': { failed: { required: true } }
            }
        }));
    });
    test('POST without a valid request body returns a 400 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.post('/system/admins', {});
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.id': { failed: { required: true } }
            }
        }));
    });
    test('POST with an existing sysadmin user returns a 409 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const adminUser = await getSystemAdminUser();
        const { status, data } = await client.post('/system/admins', adminUser);
        expect(status).toBe(409);
        expect(data).toEqual(expect.objectContaining({
            message: 'Conflict',
            conflictReason: 'userId'
        }));
    });
    test('POST with an unknown user returns a 404 response', async () => {
        const user: User = await createTestUser();
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const random = (Math.ceil(Math.random() * 100) + 1) * 2;
        user.id = user.id + random;
        const { status, data } = await client.post('/system/admins', user);
        expect(status).toBe(404);
        expect(data).toEqual('Not Found');
    });
    test('POST with a valid request body and user returns a 200 response', async () => {
        const user = await createTestUser();
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.post('/system/admins', user);
        expect(status).toBe(200);
        expect(data).toEqual(expect.objectContaining({
            id: expect.any(Number),
            user: expect.objectContaining({
                id: user.id,
                userName: user.userName,
                emailAddress: user.emailAddress,
                name: user.name
            }),
            role: 'ADMIN'
        }));
    });
});

describe('/system/admins/:id', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('DELETE without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().delete('/system/admins/0');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('DELETE with an invalid id in the path returns a 400 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.delete('/system/admins/abc');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'path.id': { failed: { pattern: true } }
            }
        }));
    });
    test('DELETE with an unknown id in the path returns a 404 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.delete('/system/admins/1000');
        expect(status).toBe(404);
        expect(data).toBe('Not Found');
    });
    test('DELETE with a known id in the path returns a 200 response', async () => {
        const {
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        } = process.env;
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const user = await createTestUser();
        const { data: sysAdmin } = await client.post('/system/admins', user);
        const { data: sysAdminsPostAdd } = await client.get('/system/admins');
        expect(
            sysAdminsPostAdd.find((admin: SystemAdmin) => admin.id === sysAdmin.id)
        ).toBeTruthy();
        await client.delete(`/system/admins/${sysAdmin.id}`);
        const { data: sysAdminsPostDel } = await client.get('/system/admins');
        expect(
            sysAdminsPostDel.find((admin: SystemAdmin) => admin.id === sysAdmin.id)
        ).toBeFalsy();
    });
});
