import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Story from '@requisite/model/lib/story/Story';
import { ConflictError } from '../../util/ApiErrors';

const logger = getLogger('resources/stories/StoriesUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing stories update resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            assertExists(req.feature, 'req.feature');
            assertExists(req.story, 'req.story');
            const modStory: Story = req.body as Story;

            const storyIdConflict =
                modStory.id !== null
                && modStory.id !== undefined
                && modStory.id !== req.story.id;

            const featureIdConfict =
                modStory.feature
                && modStory.feature.id !== null
                && modStory.feature.id !== undefined
                && modStory.feature.id !== req.feature.id;

            if (storyIdConflict) {
                next(new ConflictError('The story identifier in the body does not match the uri.'));
            } else if (featureIdConfict) {
                next(new ConflictError('The feature identifier in the body does not match the feature identifier from the uri.  Feature references on a story cannot be changed.'));
            } else {
                modStory.id = req.story.id;
                modStory.feature = req.feature;
                const updatedStory = await ServiceProvider
                    .getStoriesService()
                    .updateStory(modStory);
                res.status(200).send(updatedStory);
            }
        } catch(error) {
            next(error);
        }
    })();
};
