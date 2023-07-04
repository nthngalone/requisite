import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { MembershipSchema, OrganizationRole } from '@requisite/model/lib/user/Membership';
import OrgMembershipsListResource from './organization-memberships/OrgMembershipsListResource';
import OrgMembershipsUpdateResource from './organization-memberships/OrgMembershipsUpdateResource';
import OrgMembershipsDeleteResource from './organization-memberships/OrgMembershipsDeleteResource';
import OrgMembershipsGetResource from './organization-memberships/OrgMembershipsGetResource';
import OrgMembershipsCreateResource from './organization-memberships/OrgMembershipsCreateResource';
import { getEntityHandler } from '../common/ResourceEntityHandler';
import ServiceProvider from '../services/ServiceProvider';

export const OrgMembershipReqParamsSchema: unknown = {
    title: 'Organization Membership Id Params',
    description: 'Request params for org memberships',
    type: 'object',
    properties: {
        membershipId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['membershipId']
};

const orgMembershipEntityHandler = getEntityHandler(
    'orgMembership',
    'membershipId',
    ['orgId'],
    async (entityId: number, contextIds: Record<string, number>) => {
        const membership = await ServiceProvider
            .getOrganizationsService()
            .getMembership(entityId);
        return membership && membership.entity.id === contextIds.orgId
            ? membership
            : null;
    }
);

const getOrganizationMembershipsResourceRouter = (): Router => {

    const orgMembershipsResourceRouter = Router({ mergeParams: true });

    orgMembershipsResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            OrgMembershipsListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(OrganizationRole.OWNER),
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            OrgMembershipsCreateResource
        );

    orgMembershipsResourceRouter.route('/:membershipId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            orgMembershipEntityHandler,
            OrgMembershipsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgMembershipReqParamsSchema
            }),
            getOrganizationHandler(OrganizationRole.OWNER),
            orgMembershipEntityHandler,
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            OrgMembershipsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgMembershipReqParamsSchema
            }),
            getOrganizationHandler(OrganizationRole.OWNER),
            orgMembershipEntityHandler,
            OrgMembershipsDeleteResource
        );
    return orgMembershipsResourceRouter;
};

export { getOrganizationMembershipsResourceRouter };
