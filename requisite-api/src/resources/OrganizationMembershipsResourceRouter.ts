import { Router } from 'express';
import { OrganizationSchema } from '@requisite/model/lib/org/Organization';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';
import OrgMembershipsListResource from './organization-memberships/OrgMembershipsListResource';
import OrgMembershipsUpdateResource from './organization-memberships/OrgMembershipsUpdateResource';
import OrgMembershipsDeleteResource from './organization-memberships/OrgMembershipsDeleteResource';
import OrgMembershipsGetResource from './organization-memberships/OrgMembershipsGetResource';
import OrgMembershipsCreateResource from './organization-memberships/OrgMembershipsCreateResource';

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

const getOrganizationMembershipsResourceRouter = (): Router => {

    const orgMembershipsResourceRouter = Router();

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
            getValidationHandler({
                bodySchema: OrganizationSchema
            }),
            getOrganizationHandler(OrganizationRole.OWNER),
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
            OrgMembershipsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgMembershipReqParamsSchema
            }),
            getOrganizationHandler(OrganizationRole.OWNER),
            getValidationHandler({
                bodySchema: OrganizationSchema
            }),
            OrgMembershipsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(OrganizationRole.OWNER),
            getValidationHandler({
                paramsSchema: OrgMembershipReqParamsSchema
            }),
            OrgMembershipsDeleteResource
        );
    return orgMembershipsResourceRouter;
};

export { getOrganizationMembershipsResourceRouter };
