import Story from '@requisite/model/lib/story/Story';
import { runWithSequelize } from './sqlz/SqlzUtils';
import { getLogger } from '../util/Logger';
import StoryRevisionsService from './StoryRevisionsService';
import StoryRevision from '@requisite/model/lib/story/StoryRevision';
import StoryRevisionsDataModel from './sqlz/data-models/StoryRevisionsDataModel';
import ModificationState from '@requisite/model/lib/common/ModificationState';
import CompletionState from '@requisite/model/lib/common/CompletionState';
import { NotFoundError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('services/StoryRevisionsServiceSqlzImpl');

export default class StoryRevisionsServiceSqlzImpl implements StoryRevisionsService {
    async listStoryRevisions(story: Story): Promise<StoryRevision[]> {
        return (await runWithSequelize(async (sqlz) => {
            StoryRevisionsDataModel.initialize(sqlz);
            return StoryRevisionsDataModel.findAll({ where: { storyId: story.id }});
        })).map(data => StoryRevisionsDataModel.toStoryRevision(data));
    }
    async getStoryRevision(id: number): Promise<StoryRevision> {
        const revision = await runWithSequelize(async (sqlz) => {
            StoryRevisionsDataModel.initialize(sqlz);
            return StoryRevisionsDataModel.findByPk(id);
        });
        return revision ? StoryRevisionsDataModel.toStoryRevision(revision) : null;
    }
    async getStoryRevisionByStoryAndRevision(
        story: Story, revisionNumber: number
    ): Promise<StoryRevision> {
        const revision = await runWithSequelize(async (sqlz) => {
            StoryRevisionsDataModel.initialize(sqlz);
            return StoryRevisionsDataModel.findOne({
                where: { storyId: story.id, revisionNumber }
            });
        });
        return revision ? StoryRevisionsDataModel.toStoryRevision(revision) : null;
    }
    async createStoryRevision(story: Story): Promise<StoryRevision> {
        return StoryRevisionsDataModel.toStoryRevision(
            await runWithSequelize(async (sqlz) => {
                StoryRevisionsDataModel.initialize(sqlz);
                const revisions = await this.listStoryRevisions(story);
                const revision = revisions.length > 0
                    ? revisions[revisions.length - 1]
                    : { revisionNumber: 0 } as StoryRevision;

                const acceptanceCriteria = revision.acceptanceCriteria
                    .filter(
                        crit => crit.modificationState !== ModificationState.REMOVED
                    )
                    .map(criteria => ({
                        ...criteria,
                        modificationState: ModificationState.UNCHANGED,
                        previousCriteria: criteria
                    }));

                const { id } = await StoryRevisionsDataModel.create({
                    revisionNumber: revision.revisionNumber + 1,
                    acceptanceCriteria,
                    completionState: CompletionState.REFINEMENT,
                    modificationState: ModificationState.UPDATED,
                    story
                });
                return StoryRevisionsDataModel.findByPk(id);
            })
        );
    }
    async updateStoryRevision(revision: StoryRevision): Promise<StoryRevision> {
        const [count] = await runWithSequelize(async (sqlz) => {
            StoryRevisionsDataModel.initialize(sqlz);
            const { id } = revision;
            return StoryRevisionsDataModel.update(
                revision,
                { where: { id }}
            );
        });
        if (count === 0) {
            throw new NotFoundError();
        }
        return revision;
    }
    async deleteStoryRevision(revision: StoryRevision): Promise<void> {
        const count = await runWithSequelize(async (sqlz) => {
            const { id } = revision;
            StoryRevisionsDataModel.initialize(sqlz);
            return StoryRevisionsDataModel.destroy({ where: { id }});
        });
        if (count === 0) {
            throw new NotFoundError();
        }
    }

}
