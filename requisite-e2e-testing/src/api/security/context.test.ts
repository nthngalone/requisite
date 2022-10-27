/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient, getSecuredClient } from '../ClientUtils';
import { createTestUser, afterAllDeleteCreatedUsers } from '../../TestUtils';

describe('/security/context', () => {
    afterAll(afterAllDeleteCreatedUsers);
    test('GET without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().get('/security/context');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('GET with a valid token returns a 200 response with user data', async () => {
        const user = await createTestUser();
        const { domain, userName, password, emailAddress, name } = user as any;
        const client = await getSecuredClient(domain, userName, password);
        const { data: context } = await client.get('/security/context');
        expect(context.user.userName).toBe(userName);
        expect(context.user.emailAddress).toBe(emailAddress);
        expect(context.user.name.firstName).toBe(name.firstName);
        expect(context.user.name.lastName).toBe(name.lastName);
    });
});
