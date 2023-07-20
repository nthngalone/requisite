import Entity from '../Entity';
import Persona from '../product/Persona';
import StoryRevision from './StoryRevision';

export default interface StoryPersona extends Entity {

    storyRevision: StoryRevision;
    persona: Persona;
}
