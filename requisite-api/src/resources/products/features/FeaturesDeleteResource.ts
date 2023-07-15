import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Feature from '@requisite/model/lib/product/Feature';

const logger = getLogger('resources/products/features/FeaturesDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing features delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.entity, 'req.entity');
            const feature = req.entity as Feature;
            await ServiceProvider
                .getFeaturesService()
                .deleteFeature(feature);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
