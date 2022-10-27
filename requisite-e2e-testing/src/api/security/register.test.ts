/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient } from '../ClientUtils';
import { createTestUser, afterAllDeleteCreatedUsers, testUserNamePrefix } from '../../TestUtils';

describe('/security/register', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('POST with no data returns a 400 response with 5 validation errors', async () => {
        const { status, data } = await getClient().post('/security/register');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: expect.any(Object)
        }));
        expect(Object.keys(data.errors).length).toBe(5);
    });
    test('POST with only a user name returns a 400 response with 4 validation errors', async () => {
        const { status, data } = await getClient().post('/security/register', { userName: 'user' });
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: expect.any(Object)
        }));
        expect(Object.keys(data.errors).length).toBe(4);
    });
    test('POST with valid registration criteria returns a 200 response with the user details', async () => {
        const { data, status, headers } = await getClient().post('/security/register', {
            domain: 'local',
            userName: `${testUserNamePrefix}RegistrationSuccess`,
            emailAddress: 'user@domain.org',
            name: {
                firstName: 'First',
                lastName: 'Last'
            },
            password: 'p@$$w0rd',
            termsAgreement: true
        });
        expect(status).toBe(200);
        expect(data).toEqual(expect.objectContaining({
            id: expect.any(Number),
            message: 'Registered'
        }));
        const token = headers['x-authorization'];
        expect(data).toEqual(expect.objectContaining({
            message: 'Registered'
        }));
        expect(token).not.toBeUndefined();
        expect(token).not.toBeNull();
        expect(token.length).toBeGreaterThan(0);
    });
    test('POST with a duplicate user name and domain returns a 409 Conflict response', async () => {
        const user = await createTestUser();
        const { domain, userName } = user as never;
        const { status, data } = await getClient().post('/security/register', {
            domain,
            userName,
            emailAddress: 'duplicateDomainAndUserNameTest@requisite.io',
            name: {
                firstName: 'First',
                lastName: 'Last'
            },
            password: 'p@$$w0rd',
            termsAgreement: true
        });
        expect(status).toBe(409);
        expect(data).toEqual(expect.objectContaining({
            conflictReason: 'domain, userName'
        }));
    });
    test('POST with a duplicate email address returns a 409 Conflict response', async () => {
        const user = await createTestUser();
        const { emailAddress } = user as never;
        const { status, data } = await getClient().post('/security/register', {
            userName: `${testUserNamePrefix}RegistrationEmailConflict`,
            emailAddress,
            name: {
                firstName: 'First',
                lastName: 'Last'
            },
            password: 'p@$$w0rd',
            termsAgreement: true
        });
        expect(status).toBe(409);
        expect(data).toEqual(expect.objectContaining({
            conflictReason: 'emailAddress'
        }));
    });
});
