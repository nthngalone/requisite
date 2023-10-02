import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/stories/StoriesGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing stories get resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            assertExists(req.feature, 'req.feature');
            assertExists(req.story, 'req.story');
            res.status(200).send(req.story);
        } catch(error) {
            next(error);
        }
    })();
};
