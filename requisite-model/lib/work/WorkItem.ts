import type CompletionState from '../common/CompletionState';
import type Entity from '../Entity';
import type DefinitionOfDone from './DefinitionOfDone';
import type Task from './Task';

export default interface StoryRevision extends Entity {

    storyRevision: StoryRevision;
    definitionOfDone: DefinitionOfDone;
    completionState: CompletionState;
    size: number;
    billingCode: string;
    tasks?: Task[];
}
