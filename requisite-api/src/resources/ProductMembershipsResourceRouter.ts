import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { MembershipSchema, ProductRole } from '@requisite/model/lib/user/Membership';
import ProductMembershipsListResource from './products/memberships/ProductMembershipsListResource';
import ProductMembershipsUpdateResource from './products/memberships/ProductMembershipsUpdateResource';
import ProductMembershipsDeleteResource from './products/memberships/ProductMembershipsDeleteResource';
import ProductMembershipsGetResource from './products/memberships/ProductMembershipsGetResource';
import ProductMembershipsCreateResource from './products/memberships/ProductMembershipsCreateResource';
import { getEntityHandler } from '../common/ResourceEntityHandler';
import ServiceProvider from '../services/ServiceProvider';
import { getProductHandler } from '../common/ResourceProductHandler';

export const ProductMembershipReqParamsSchema: unknown = {
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

const productMembershipEntityHandler = getEntityHandler(
    'productMembership',
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

    const productMembershipsResourceRouter = Router({ mergeParams: true });

    productMembershipsResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(),
            ProductMembershipsListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            ProductMembershipsCreateResource
        );

    productMembershipsResourceRouter.route('/:membershipId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            productMembershipEntityHandler,
            ProductMembershipsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            productMembershipEntityHandler,
            getValidationHandler({
                bodySchema: MembershipSchema
            }),
            ProductMembershipsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductMembershipReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            productMembershipEntityHandler,
            ProductMembershipsDeleteResource
        );
    return productMembershipsResourceRouter;
};

export { getProductMembershipsResourceRouter };
