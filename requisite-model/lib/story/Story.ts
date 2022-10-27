import Entity from '../Entity';
import Constituent from '../product/Constituent';
import Feature from '../product/Feature';
import StoryRevision from './StoryRevision';

export default interface Story extends Entity {

    feature?: Feature;
    title: string;
    description: string;
    constituent: Constituent;
    revisions?: StoryRevision[];
}
