import type Entity from '../Entity';
import type Persona from '../product/Persona';
import type StoryRevision from './StoryRevision';

export default interface StoryPersona extends Entity {

    storyRevision: StoryRevision;
    persona: Persona;
}
