import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { ConflictError } from '../../../util/ApiErrors';
import type Feature from '@requisite/model/lib/product/Feature';

const logger = getLogger('resources/products/features/FeaturesUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing features update resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.feature, 'req.feature');

            const feature = req.feature as Feature;
            const modFeature: Feature = req.body as Feature;

            const featureIdConflict =
                modFeature.id !== null
                && modFeature.id !== undefined
                && modFeature.id !== feature.id;

            const productIdConfict =
                modFeature.product
                && modFeature.product.id !== null
                && modFeature.product.id !== undefined
                && modFeature.product.id !== feature.product.id;

            if (featureIdConflict) {
                next(new ConflictError('The feature identifier in the body does not match the uri.'));
            } else if (productIdConfict) {
                next(new ConflictError('The product identifier in the body does not match the product identifier from the uri.  Product references on a feature cannot be changed.'));
            } else {
                modFeature.id = feature.id;
                modFeature.product = feature.product;
                const updatedFeature = await ServiceProvider
                    .getFeaturesService()
                    .updateFeature(modFeature);
                res.status(200).send(updatedFeature);
            }
        } catch(error) {
            next(error);
        }
    })();
};
