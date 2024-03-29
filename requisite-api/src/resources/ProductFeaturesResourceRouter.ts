import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import FeaturesListResource from './products/features/FeaturesListResource';
import FeaturesUpdateResource from './products/features/FeaturesUpdateResource';
import FeaturesGetResource from './products/features/FeaturesGetResource';
import FeaturesCreateResource from './products/features/FeaturesCreateResource';
import FeaturesDeleteResource from './products/features/FeaturesDeleteResource';
import { getProductHandler } from '../common/ResourceProductHandler';
import { FeatureSchema } from '@requisite/model/lib/product/Feature';
import { getProductFeatureHandler } from '../common/ResourceProductFeatureHandler';

export const ProductFeatureReqParamsSchema: unknown = {
    title: 'Product Feature Id Params',
    description: 'Request params for product features',
    type: 'object',
    properties: {
        featureId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['featureId']
};

const getProductFeaturesResourceRouter = (): Router => {

    const productFeaturesResourceRouter = Router({ mergeParams: true });

    productFeaturesResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(),
            FeaturesListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getValidationHandler({
                bodySchema: FeatureSchema
            }),
            FeaturesCreateResource
        );

    productFeaturesResourceRouter.route('/:featureId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductFeatureReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            getProductFeatureHandler(),
            FeaturesGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductFeatureReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getProductFeatureHandler(),
            getValidationHandler({
                bodySchema: FeatureSchema
            }),
            FeaturesUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductFeatureReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getProductFeatureHandler(),
            FeaturesDeleteResource
        );
    return productFeaturesResourceRouter;
};

export { getProductFeaturesResourceRouter };
