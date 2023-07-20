import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import StoriesListResource from './stories/StoriesListResource';
import StoriesUpdateResource from './stories/StoriesUpdateResource';
import StoriesGetResource from './stories/StoriesGetResource';
import StoriesCreateResource from './stories/StoriesCreateResource';
import StoriesDeleteResource from './stories/StoriesDeleteResource';
import { getProductHandler } from '../common/ResourceProductHandler';
import { StorySchema } from '@requisite/model/lib/story/Story';
import { getProductFeatureHandler } from '../common/ResourceProductFeatureHandler';
import { getStoryHandler } from '../common/ResourceStoryHandler';

export const StoriesReqParamsSchema: unknown = {
    title: 'Stories Id Params',
    description: 'Request params for stories',
    type: 'object',
    properties: {
        storyId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['storyId']
};

const getStoriesResourceRouter = (): Router => {

    const storiesResourceRouter = Router({ mergeParams: true });

    storiesResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(),
            getProductFeatureHandler(),
            StoriesListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getProductFeatureHandler(),
            getValidationHandler({
                bodySchema: StorySchema
            }),
            StoriesCreateResource
        );

    storiesResourceRouter.route('/:storyId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: StoriesReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            getProductFeatureHandler(),
            getStoryHandler(),
            StoriesGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: StoriesReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getProductFeatureHandler(),
            getStoryHandler(),
            getValidationHandler({
                bodySchema: StorySchema
            }),
            StoriesUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: StoriesReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getProductFeatureHandler(),
            getStoryHandler(),
            StoriesDeleteResource
        );
    return storiesResourceRouter;
};

export { getStoriesResourceRouter };
