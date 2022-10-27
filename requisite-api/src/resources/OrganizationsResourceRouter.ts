import { Router } from 'express';
import OrgsListResource from './organizations/OrgsListResource';
import OrgsGetResource from './organizations/OrgsGetResource';
import OrgsCreateResource from './organizations/OrgsCreateResource';
import OrgsUpdateResource from './organizations/OrgsUpdateResource';
import OrgsDeleteResource from './organizations/OrgsDeleteResource';
import { OrganizationSchema } from '@requisite/model/lib/org/Organization';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getSystemAdminOnlyHandler } from '../common/ResourceSystemAdminOnlyHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

export const OrgReqParamsSchema: unknown = {
    title: 'Organization Id Params',
    description: 'Request params for orgs',
    type: 'object',
    properties: {
        orgId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['orgId']
};

const getOrganizationsResourceRouter = (): Router => {

    const orgsResourceRouter = Router();

    orgsResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            OrgsListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getSystemAdminOnlyHandler(),
            getValidationHandler({
                bodySchema: OrganizationSchema
            }),
            OrgsCreateResource
        );

    orgsResourceRouter.route('/:orgId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgReqParamsSchema
            }),
            getOrganizationHandler(),
            OrgsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: OrgReqParamsSchema
            }),
            getOrganizationHandler(OrganizationRole.OWNER),
            getValidationHandler({
                bodySchema: OrganizationSchema
            }),
            OrgsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getSystemAdminOnlyHandler(),
            getValidationHandler({
                paramsSchema: OrgReqParamsSchema
            }),
            OrgsDeleteResource
        );
    return orgsResourceRouter;
};

export { getOrganizationsResourceRouter };
