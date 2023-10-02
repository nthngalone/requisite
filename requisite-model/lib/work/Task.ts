import type CompletionState from '../common/CompletionState';
import type Entity from '../Entity';
import type StoryRevision from '../story/StoryRevision';

export default interface Story extends Entity {

    storyRevision: StoryRevision;
    title: string;
    description: string;
    completionState: CompletionState;
}
