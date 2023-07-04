import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { MembershipSchema, ProductRole } from '@requisite/model/lib/user/Membership';
import ProdMembershipsListResource from './product-memberships/ProdMembershipsListResource';
import ProdMembershipsUpdateResource from './product-memberships/ProdMembershipsUpdateResource';
import ProdMembershipsDeleteResource from './product-memberships/ProdMembershipsDeleteResource';
import ProdMembershipsGetResource from './product-memberships/ProdMembershipsGetResource';
import ProdMembershipsCreateResource from './product-memberships/ProdMembershipsCreateResource';
import { getEntityHandler } from '../common/ResourceEntityHandler';
import ServiceProvider from '../services/ServiceProvider';
import { getProductHandler } from '../common/ResourceProductHandler';

export const ProdMembershipReqParamsSchema: unknown = {
    title: 'Product Membership Id Params',
    description: 'Request params for product memberships',
    type: 'object',
    properties: {
        membershipId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['membershipId']
};

const prodMembershipEntityHandler = getEntityHandler(
    'prodMembership',
    'membershipId',
    ['orgId', 'productId'],
    async (entityId: number, contextIds: Record<string, number>) => {
        const membership = await ServiceProvider
            .getProductsService()
            .getMembership(entityId);
        return (membership
            && membership.entity.organization.id === contextIds.orgId
            && membership.entity.id === contextIds.productId)
            ? membership
            : null;
    }
);

const getProductMembershipsResourceRouter = (): Router => {

    const prodMembershipsResourceRouter = Router({ mergeParams: true });

    prodMembershipsResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(),
            ProdMembershipsListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            ProdMembershipsCreateResource
        );

    prodMembershipsResourceRouter.route('/:membershipId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProdMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            prodMembershipEntityHandler,
            ProdMembershipsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProdMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            prodMembershipEntityHandler,
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            ProdMembershipsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProdMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            prodMembershipEntityHandler,
            ProdMembershipsDeleteResource
        );
    return prodMembershipsResourceRouter;
};

export { getProductMembershipsResourceRouter };
