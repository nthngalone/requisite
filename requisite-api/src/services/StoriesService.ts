import Constituent from '@requisite/model/lib/product/Constituent';
import Story from '@requisite/model/lib/story/Story';
import Feature from '@requisite/model/lib/product/Feature';

export default interface StoriesService {
    listStories(feature: Feature): Promise<Story[]>;
    listStoriesForConstituent(
        feature: Feature, constituent: Constituent
    ): Promise<Story[]>;
    getStory(id: number): Promise<Story>;
    createStory(story: Story): Promise<Story>;
    updateStory(story: Story): Promise<Story>;
    deleteStory(story: Story): Promise<void>;
}
