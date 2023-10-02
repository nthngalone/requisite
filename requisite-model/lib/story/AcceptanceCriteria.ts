import type ModificationState from '../common/ModificationState';
import type Entity from '../Entity';

export default interface AcceptanceCriteria extends Entity {

    description: string;
    modificationState: ModificationState;
    previousCriteria: AcceptanceCriteria;
}
