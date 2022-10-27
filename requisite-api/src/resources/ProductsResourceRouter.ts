import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import ProductsListResource from './products/ProductsListResource';
import ProductsGetResource from './products/ProductsGetResource';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { getProductHandler } from '../common/ResourceProductHandler';
import ProductsCreateResource from './products/ProductsCreateResource';
import { OrganizationRole, ProductRole } from '@requisite/model/lib/user/Membership';
import { ProductSchema } from '@requisite/model/lib/product/Product';
import ProductsUpdateResource from './products/ProductsUpdateResource';
import ProductsDeleteResource from './products/ProductsDeleteResource';

export const ProductReqParamsSchema: unknown = {
    title: 'Product Id Params',
    description: 'Request params for products',
    type: 'object',
    properties: {
        orgId: {
            type: 'string',
            pattern: '[0-9]+'
        },
        productId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['orgId', 'productId']
};

const getProductsResourceRouter = (): Router => {

    // mergeParams option merges path params from parent path and router path
    const productsResourceRouter = Router({ mergeParams: true });

    productsResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            ProductsListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(OrganizationRole.OWNER),
            getValidationHandler({
                bodySchema: ProductSchema
            }),
            ProductsCreateResource
        );

    productsResourceRouter.route('/:productId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            ProductsGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getValidationHandler({
                bodySchema: ProductSchema
            }),
            ProductsUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            ProductsDeleteResource
        );
    return productsResourceRouter;
};

export { getProductsResourceRouter };
