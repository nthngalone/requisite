import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Feature from '@requisite/model/lib/product/Feature';

const logger = getLogger('resources/products/features/FeaturesDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing features delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.feature, 'req.feature');
            const feature = req.feature as Feature;
            await ServiceProvider
                .getFeaturesService()
                .deleteFeature(feature);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
