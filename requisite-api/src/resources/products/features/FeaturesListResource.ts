import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/features/FeaturesListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product features list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.product, 'req.product');
            const product = req.product;
            const features = await ServiceProvider
                .getFeaturesService()
                .listFeatures(product);
            res.status(200).send(features);
        } catch(error) {
            next(error);
        }
    })();
};
