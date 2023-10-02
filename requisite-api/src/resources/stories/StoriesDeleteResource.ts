import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import ReleaseState from '@requisite/model/lib/common/ReleaseState';
import { ConflictError } from '../../util/ApiErrors';

const logger = getLogger('resources/stories/StoriesDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing stories delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.story, 'req.story');
            const storyRevisionsService = ServiceProvider.getStoryRevisionsService();
            const storyRevisions = await storyRevisionsService.listStoryRevisions(
                req.story
            );
            const released = storyRevisions.some(
                revision => revision.releaseState === ReleaseState.RELEASED
            );
            if (released) {
                next(new ConflictError('Released stories cannot be deleted, they can only be archived.'));
            } else {
                await Promise.all(storyRevisions.map(
                    revision => storyRevisionsService.deleteStoryRevision(revision)
                ));
                await ServiceProvider
                    .getStoriesService()
                    .deleteStory(req.story);
                res.status(200).send();
            }
        } catch(error) {
            next(error);
        }
    })();
};
