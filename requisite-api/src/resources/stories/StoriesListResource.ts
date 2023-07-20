import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/stories/StoriesListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing stories list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            assertExists(req.feature, 'req.feature');
            const feature = req.feature;
            const stories = await ServiceProvider
                .getStoriesService()
                .listStories(feature);
            res.status(200).send(stories);
        } catch(error) {
            next(error);
        }
    })();
};
