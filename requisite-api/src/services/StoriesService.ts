import type Persona from '@requisite/model/lib/product/Persona';
import type Story from '@requisite/model/lib/story/Story';
import type Feature from '@requisite/model/lib/product/Feature';

export default interface StoriesService {
    listStories(feature: Feature): Promise<Story[]>;
    listStoriesForPersona(
        feature: Feature, persona: Persona
    ): Promise<Story[]>;
    getStory(id: number): Promise<Story>;
    createStory(story: Story): Promise<Story>;
    updateStory(story: Story): Promise<Story>;
    deleteStory(story: Story): Promise<void>;
}
