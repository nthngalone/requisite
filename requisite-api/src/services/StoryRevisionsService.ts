import Story from '@requisite/model/lib/story/Story';
import StoryRevision from '@requisite/model/lib/story/StoryRevision';

export default interface StoryRevisionsService {
    listStoryRevisions(story: Story): Promise<StoryRevision[]>;
    getStoryRevision(id: number): Promise<StoryRevision>;
    getStoryRevisionByStoryAndRevision(
        story: Story, revision: number
    ): Promise<StoryRevision>;
    createStoryRevision(story: Story): Promise<StoryRevision>;
    updateStoryRevision(revision: StoryRevision): Promise<StoryRevision>;
    deleteStoryRevision(revision: StoryRevision): Promise<void>;
}
