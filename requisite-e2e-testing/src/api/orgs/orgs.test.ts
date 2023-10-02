/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient, getSecuredClient } from '../ClientUtils';
import { createTestUser, afterAllDeleteCreatedUsers, testOrgNamePrefix, createTestOrg, afterAllDeleteCreatedOrgs } from '../../TestUtils';
import type Organization from '@requisite/model/lib/org/Organization';

const { SYSADMIN_DOMAIN, SYSADMIN_USERNAME, SYSADMIN_PASSWORD } = process.env;

describe('/orgs', () => {
    afterAll(afterAllDeleteCreatedUsers);
    afterAll(afterAllDeleteCreatedOrgs);
    test('GET without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().get('/orgs');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('GET with a valid token returns a 200 response with empty org data', async () => {
        const user = await createTestUser();
        const { domain, userName, password } = user as any;
        const client = await getSecuredClient(domain, userName, password);
        const { data } = await client.get('/orgs');
        expect(data).toEqual(expect.any(Array));
    });
    test('POST without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().post('/orgs');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('POST with a non system admin token returns a 403 response', async () => {
        const user = await createTestUser();
        const { domain, userName, password } = user as any;
        const client = await getSecuredClient(domain, userName, password);
        const { status } = await client.post('/orgs');
        expect(status).toBe(403);
    });
    test('POST with a valid token but empty body returns a 400 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.post('/orgs');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.name': { failed: { required: true } }
            }
        }));
    });
    test('POST with a valid token and valid body creates a new org and returns a 200 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { data: newOrg } = await client.post('/orgs', { name: `${testOrgNamePrefix} Test Org` });
        expect(newOrg.id).toEqual(expect.any(Number));
        expect(newOrg.name).toBe(`${testOrgNamePrefix} Test Org`);
        // Make sure that new org exists in the orgs collection
        const { data: orgs } = await client.get('/orgs');
        const foundOrg = orgs.find(
            (listOrg: Organization) => listOrg.id === newOrg.id
        );
        expect(foundOrg).toBeTruthy();
        expect(foundOrg.name).toEqual(newOrg.name);
        // Make sure that the new org can be retrieved
        const { data: org } = await client.get(`/orgs/${newOrg.id}`);
        expect(org).toBeTruthy();
        expect(org.name).toEqual(newOrg.name);
    });
});

describe('/orgs/:orgId', () => {
    afterAll(afterAllDeleteCreatedUsers);
    afterAll(afterAllDeleteCreatedOrgs);
    test('GET without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().get('/orgs/0');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('GET with an invalid id as a system admin returns a 400 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.get('/orgs/abc');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'path.orgId': { failed: { pattern: true } }
            }
        }));
    });
    test('GET with an unknown id as a system admin returns a 404 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.get('/orgs/123');
        expect(status).toBe(404);
        expect(data).toBe('Not Found');
    });
    test('GET with a known id as a system admin returns a 200 response with the org details', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const org = await createTestOrg(client);
        const { status, data } = await client.get(`/orgs/${org.id}`);
        expect(status).toBe(200);
        expect(data).toEqual(org);
    });
    test('PUT without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().put('/orgs/0');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('PUT with an unknown id as a system admin returns a 404 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.put('/orgs/123', {
            name: 'Unknown Updated'
        });
        expect(status).toEqual(404);
        expect(data).toEqual('Not Found');
    });
    test('PUT with a known id but empty body as a system admin returns a 400 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const org = await createTestOrg(client);
        const { status, data } = await client.put(`/orgs/${org.id}`, {});
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'body.name': { failed: { required: true } }
            }
        }));
    });
    test('PUT with an invalid id as a system admin returns a 400 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.put('/orgs/abc', {
            name: 'Invalid Id Updated'
        });
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'path.orgId': { failed: { pattern: true } }
            }
        }));
    });
    test('PUT with a known id and valid body as a system admin returns a 200 response with updated data', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const org = await createTestOrg(client);
        const name = `${org.name} Updated`;
        const { status, data: updatedOrg } = await client.put(`/orgs/${org.id}`, { name });
        // Assert that the updated response returns the right data
        expect(status).toBe(200);
        expect(updatedOrg.id).toEqual(org.id);
        expect(updatedOrg.name).toEqual(name);
        // Assert that retrieving the id fresh returns the updated data
        const { data: retrOrg } = await client.get(`/orgs/${org.id}`);
        expect(retrOrg.name).toEqual(name);
    });
    test('DELETE without a valid token returns a 401 response', async () => {
        const { status, data } = await getClient().delete('/orgs/0');
        expect(status).toBe(401);
        expect(data).toBe('Unauthorized');
    });
    test('DELETE with a non system admin token returns a 403 response', async () => {
        const user = await createTestUser();
        const { domain, userName, password } = user as any;
        const client = await getSecuredClient(domain, userName, password);
        const { status } = await client.delete('/orgs/0');
        expect(status).toBe(403);
    });
    test('DELETE with an invalid id returns a 400 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.delete('/orgs/abc');
        expect(status).toBe(400);
        expect(data).toEqual(expect.objectContaining({
            valid: false,
            errors: {
                'path.orgId': { failed: { pattern: true } }
            }
        }));
    });
    test('DELETE with an unknown id returns a 404 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const { status, data } = await client.delete('/orgs/123');
        expect(status).toEqual(404);
        expect(data).toEqual('Not Found');
    });
    test('DELETE with a known id returns a 200 response', async () => {
        const client = await getSecuredClient(
            SYSADMIN_DOMAIN,
            SYSADMIN_USERNAME,
            SYSADMIN_PASSWORD
        );
        const org = await createTestOrg(client);
        const { status: deleteStatus } = await client.delete(`/orgs/${org.id}`);
        // Assert that the delete response returns the right data
        expect(deleteStatus).toEqual(200);
        // Assert that retrieving the id directly returns a 404
        const { status: getStatus } = await client.get(`/orgs/${org.id}`);
        expect(getStatus).toEqual(404);
    });
});
