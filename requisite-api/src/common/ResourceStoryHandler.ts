import { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotFoundError } from '../util/ApiErrors';

const logger = getLogger('common/ResourceStoryHandler');

const getStoryHandler = () => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.feature, 'req.feature');
                assertExists(req.params.storyId, 'req.params.storyId');
                assertExists(req.securityContext, 'req.securityContext');
                const storyId = parseInt(req.params.storyId);
                const featureId = req.feature.id;
                logger.debug(`Looking up the story for story id [${storyId}]`);
                const story = await ServiceProvider
                    .getStoriesService()
                    .getStory(storyId);
                if (story && story.feature.id === featureId) {
                    req.story = story;
                    next();
                } else {
                    next(new NotFoundError(`Story [${storyId}] not found for feature [${featureId}]`));
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getStoryHandler };
