import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Story from '@requisite/model/lib/story/Story';

const logger = getLogger('resources/stories/StoriesCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing stories create resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.product, 'req.product');
            assertExists(req.feature, 'req.feature');
            const newStory: Story = req.body as Story;
            newStory.feature = req.feature;
            const story = await ServiceProvider
                .getStoriesService()
                .createStory(newStory);
            res.status(200).send(story);
        } catch(error) {
            next(error);
        }
    })();
};
