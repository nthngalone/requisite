import '../supertest.mock.sqlz';
import '../supertest.mock.jsonwebtoken';
import request from 'supertest';
import { getApp } from '../../src/app';
import { configure } from '../../src/util/Logger';
import { ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { getMockedAuthBearerForUser, getMockedAuthBearerForProductMembership, getMockedAuthBearerSystemAdmin, getMockedFeature, getMockedStory, getMockedStories, getMockedStoryRevision, getMockedStoryRevisions } from '../mockUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Feature from '@requisite/model/lib/product/Feature';
import Product from '@requisite/model/lib/product/Product';
import ReleaseState from '@requisite/model/lib/common/ReleaseState';
import Story from '@requisite/model/lib/story/Story';

configure('ERROR');

describe('DELETE /orgs/<orgId>/products/<productId>/features/<featureId>/stories/<storyId>', () => {
    test('returns a 401 Unauthorized response when no auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when an invalid auth header is present', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', 'Bearer invalid')
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for an unknown user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ unknown: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 401 Unauthorized response when a valid auth header is present for a revoked user', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForUser({ revoked: true }))
            .expect(401, 'Unauthorized');
    });
    test('returns a 403 Not Authorized when a valid auth header is present but not for a product owner', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: 'CONTRIBUTOR'
            }))
            .expect(403, 'Not Authorized');
    });
    test('returns a 400 Bad Request response when an invalid index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/abc`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(400)
            .then((res) => {
                const results = res.body as ValidationResult;
                expect(results.valid).toBe(false);
                expect(Object.keys(results.errors || {}).length).toBe(1);
            });
    });
    test('returns a 404 Not Found response when an unknown index', async () => {
        const feature = await getMockedFeature();
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/12345`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(404, 'Not Found');
    });
    test('returns a 409 Conflict when a story has a revision in the released state', async () => {
        const storyRevision = await getMockedStoryRevision({
            releaseState: ReleaseState.RELEASED
        });
        const story = storyRevision.story as Story;
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(409);
    });
    test('returns a 200 with data when a valid auth header is present for a sys admin', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const stories = await getMockedStories(feature);
        const storiesCount = stories.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerSystemAdmin())
            .expect(200)
            .then(async () => {
                const updatedStories = await getMockedStories(feature);
                expect(updatedStories.length).toBe(storiesCount - 1);
            });
    });
    test('returns a 200 with data when a valid auth header is present for a product owner', async () => {
        const story = await getMockedStory();
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const stories = await getMockedStories(feature);
        const storiesCount = stories.length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: 'OWNER'
            }))
            .expect(200)
            .then(async () => {
                const updatedStories = await getMockedStories(feature);
                expect(updatedStories.length).toBe(storiesCount - 1);
            });
    });
    test('returns a 200 and removes any revisions if no released revisions exist', async () => {
        const storyRevision = await getMockedStoryRevision();
        const story = storyRevision.story as Story;
        const feature = story.feature as Feature;
        const product = feature.product as Product;
        const org = product.organization as Organization;
        const storiesCount = (await getMockedStories(feature)).length;
        const storyRevisionsCount = (await getMockedStoryRevisions(story)).length;
        return request(getApp())
            .delete(`/orgs/${org.id}/products/${product.id}/features/${feature.id}/stories/${story.id}`)
            .set('Authorization', await getMockedAuthBearerForProductMembership({
                entity: product,
                role: 'OWNER'
            }))
            .expect(200)
            .then(async () => {
                const updStoriesCount = (await getMockedStories(feature)).length;
                const updStoryRevCount = (await getMockedStoryRevisions(story)).length;
                expect(updStoriesCount).toBe(storiesCount - 1);
                expect(updStoryRevCount).toBe(storyRevisionsCount - 1);
            });
    });
});
