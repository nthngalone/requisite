import CompletionState from '../common/CompletionState';
import Entity from '../Entity';
import DefinitionOfDone from './DefinitionOfDone';
import Task from './Task';

export default interface StoryRevision extends Entity {

    storyRevision: StoryRevision;
    definitionOfDone: DefinitionOfDone;
    completionState: CompletionState;
    size: number;
    billingCode: string;
    tasks?: Task[];
}
