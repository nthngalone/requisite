import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/features/FeaturesGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product features get resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.feature, 'req.feature');
            res.status(200).send(req.feature);
        } catch(error) {
            next(error);
        }
    })();
};
