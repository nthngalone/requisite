import Constituent from '@requisite/model/lib/product/Constituent';
import Story from '@requisite/model/lib/story/Story';
import StoriesService from './StoriesService';
import { runWithSequelize } from './sqlz/SqlzUtils';
import { getLogger } from '../util/Logger';
import StoriesDataModel from './sqlz/data-models/StoriesDataModel';
import Feature from '@requisite/model/lib/product/Feature';
import StoryRevisionsDataModel from './sqlz/data-models/StoryRevisionsDataModel';
import CompletionState from '@requisite/model/lib/common/CompletionState';
import ModificationState from '@requisite/model/lib/common/ModificationState';
import { NotFoundError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/StoriesServiceSqlzImpl');

export default class StoriesServiceSqlzImpl implements StoriesService {
    async listStories(feature: Feature): Promise<Story[]> {
        return (await runWithSequelize(async (sqlz) => {
            StoriesDataModel.initialize(sqlz);
            return StoriesDataModel.findAll({ where: { featureId: feature.id }});
        })).map(data => StoriesDataModel.toStory(data));
    }
    async listStoriesForConstituent(
        feature: Feature, constituent: Constituent
    ): Promise<Story[]> {
        return (await runWithSequelize(async (sqlz) => {
            StoriesDataModel.initialize(sqlz);
            return StoriesDataModel.findAll({ where: {
                featureId: feature.id,
                constituentId: constituent.id
            }});
        })).map(data => StoriesDataModel.toStory(data));
    }
    async getStory(id: number): Promise<Story> {
        const story = await runWithSequelize(async (sqlz) => {
            StoriesDataModel.initialize(sqlz);
            return StoriesDataModel.findByPk(id);
        });
        return story ? StoriesDataModel.toStory(story) : null;
    }
    async createStory(story: Story): Promise<Story> {
        return StoriesDataModel.toStory(
            await runWithSequelize(async (sqlz) => {
                StoriesDataModel.initialize(sqlz);
                const { id } = await StoriesDataModel.create({ ...story });
                StoryRevisionsDataModel.initialize(sqlz);
                const initialRevision = StoryRevisionsDataModel.toStoryRevision(
                    await StoryRevisionsDataModel.create({
                        revisionNumber: 1,
                        acceptanceCriteria: [],
                        completionState: CompletionState.REFINEMENT,
                        modificationState: ModificationState.UPDATED,
                        story: { id }
                    })
                );
                const newStory = await StoriesDataModel.findByPk(id);
                (newStory as Story).revisions = [ initialRevision ];
                return newStory;
            })
        );
    }
    async updateStory(story: Story): Promise<Story> {
        const [count] = await runWithSequelize(async (sqlz) => {
            StoriesDataModel.initialize(sqlz);
            const { id } = story;
            return StoriesDataModel.update(
                story,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return story;
    }
    async deleteStory(story: Story): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = story;
            StoriesDataModel.initialize(sqlz);
            return StoriesDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }
}
