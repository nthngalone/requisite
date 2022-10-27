import CompletionState from '../common/CompletionState';
import Entity from '../Entity';
import StoryRevision from './StoryRevision';

export default interface Story extends Entity {

    storyRevision: StoryRevision;
    title: string;
    description: string;
    completionState: CompletionState;
}
