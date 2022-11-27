import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership, { OrganizationRole } from '@requisite/model/lib/user/Membership';
import { getMockedOrg, getMockedOrgMembership, getMockedUserForSystemAdmin, getMockedUser, getMockedUserForOrgMembership } from '../mockUtils';

configure('ERROR');

describe('PUT /orgs/<orgId>/memberships/<orgMembershipId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .set('Authorization', 'Bearer valid|local|unknown')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const revokedUser = await getMockedUser({ revoked: true });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${revokedUser.userName}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for an org owner', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const orgMember = await getMockedUserForOrgMembership({ entity: org, role: 'MEMBER' });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${orgMember.userName}`)
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const org = await getMockedOrg();
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/abc`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const org = await getMockedOrg();
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/12345`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(404, 'Not Found');
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but no body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(3);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ user: { id: 0 }})
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only an entity in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ entity: { id: 0 } })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only a role in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ role: 'OWNER' })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(2);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user and entity in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ user: { id: 1 }, entity: { id: 0 } })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only user and role in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ user: { id: 1 }, role: 'OWNER' })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 400 Bad Request response for a valid auth header for the request resource but only an entity and role in the body', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({ entity: { id: 0 }, role: 'OWNER' })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    // TODO Tests for changing a user or entity should fail (400?).
    // Should only be able to update the role
    test('returns a 200 with data when a valid auth header and data is present for a sys admin', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const sysAdmin = await getMockedUserForSystemAdmin();
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({
                user: membership.user,
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .set('Authorization', `Bearer valid|local|${sysAdmin.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        id: membership.user.id
                    }),
                    role: 'OWNER'
                }));
            });
    });
    test('returns a 200 with data when a valid auth header and data is present for an org owner', async () => {
        const org = await getMockedOrg();
        const membership = await getMockedOrgMembership({ entity: org });
        const orgOwner = await getMockedUserForOrgMembership({ entity: org, role: 'OWNER' });
        return request(getApp())
            .put(`/orgs/${org.id}/memberships/${membership.id}`)
            .send({
                user: membership.user,
                entity: membership.entity,
                role: OrganizationRole.OWNER
            })
            .set('Authorization', `Bearer valid|local|${orgOwner.userName}`)
            .expect(200)
            .then((res) => {
                const result = res.body as Membership<Organization>;
                expect(result).toEqual(expect.objectContaining({
                    id: membership.id,
                    entity: expect.objectContaining({
                        id: membership.entity.id
                    }),
                    user: expect.objectContaining({
                        id: membership.user.id
                    }),
                    role: 'OWNER'
                }));
            });
    });
});
