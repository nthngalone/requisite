import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Feature from '@requisite/model/lib/product/Feature';

const logger = getLogger('resources/products/features/FeaturesCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing features create resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.product, 'req.product');
            const newFeature: Feature = req.body as Feature;
            newFeature.product = req.product;
            const feature = await ServiceProvider
                .getFeaturesService()
                .createFeature(newFeature);
            res.status(200).send(feature);
        } catch(error) {
            next(error);
        }
    })();
};
