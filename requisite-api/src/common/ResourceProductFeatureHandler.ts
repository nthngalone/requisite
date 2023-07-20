import { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotFoundError } from '../util/ApiErrors';

const logger = getLogger('common/ResourceProductFeatureHandler');

const getProductFeatureHandler = () => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.product, 'req.product');
                assertExists(req.params.featureId, 'req.params.featureId');
                assertExists(req.securityContext, 'req.securityContext');
                const featureId = parseInt(req.params.featureId);
                const productId = req.product.id;
                logger.debug(`Looking up the feature for feature id [${featureId}]`);
                const feature = await ServiceProvider
                    .getFeaturesService()
                    .getFeature(featureId);
                if (feature && feature.product.id === productId) {
                    req.feature = feature;
                    next();
                } else {
                    next(new NotFoundError(`Feature [${featureId}] not found for product [${productId}]`));
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getProductFeatureHandler };
