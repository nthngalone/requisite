import type ModificationState from '../common/ModificationState';
import type ReleaseState from '../common/ReleaseState';
import type Entity from '../Entity';
import type Persona from '../product/Persona';
import type AcceptanceCriteria from './AcceptanceCriteria';
import type Story from './Story';

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
