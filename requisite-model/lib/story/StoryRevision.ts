import ModificationState from '../common/ModificationState';
import ReleaseState from '../common/ReleaseState';
import Entity from '../Entity';
import Persona from '../product/Persona';
import AcceptanceCriteria from './AcceptanceCriteria';
import Story from './Story';

export default interface StoryRevision extends Entity {

    story: Story;
    revisionNumber: number;
    personas?: Persona[];
    acceptanceCriteria: AcceptanceCriteria[];
    modificationState: ModificationState;
    releaseState: ReleaseState;
    mockup: string;
    screenshot: string;
}
