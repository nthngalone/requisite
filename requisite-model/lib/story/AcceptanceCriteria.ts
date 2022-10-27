import ModificationState from '../common/ModificationState';
import Entity from '../Entity';

export default interface AcceptanceCriteria extends Entity {

    description: string;
    modificationState: ModificationState;
    previousCriteria: AcceptanceCriteria;
}
