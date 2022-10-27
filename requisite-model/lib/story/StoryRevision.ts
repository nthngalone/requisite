import CompletionState from '../common/CompletionState';
import ModificationState from '../common/ModificationState';
import Entity from '../Entity';
import AcceptanceCriteria from './AcceptanceCriteria';
import Story from './Story';
import Task from './Task';

export default interface StoryRevision extends Entity {

    story: Story;
    revisionNumber: number;
    acceptanceCriteria: AcceptanceCriteria[];
    completionState: CompletionState;
    modificationState: ModificationState;
    size: number;
    mockup: string;
    screenshot: string;
    billingCode: string;
    tasks?: Task[];
}
