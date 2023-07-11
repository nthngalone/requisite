import Entity from '../Entity';
import Persona from '../product/Persona';
import Feature from '../product/Feature';
import StoryRevision from './StoryRevision';

export default interface Story extends Entity {

    feature?: Feature;
    title: string;
    description: string;
    persona: Persona;
    revisions?: StoryRevision[];
}
