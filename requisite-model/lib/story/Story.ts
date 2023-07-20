import Entity from '../Entity';
import Feature from '../product/Feature';
import StoryRevision from './StoryRevision';

export default interface Story extends Entity {

    feature?: Feature;
    title: string;
    description: string;
    revisions?: StoryRevision[];
}

export const StorySchema: unknown = {
    title: 'Story',
    description: 'Entity representing a story',
    type: 'object',
    properties: {
        id: {
            type: 'number'
        },
        title: {
            type: 'string',
            isNotBlank: true
        },
        description: {
            type: 'string',
            isNotBlank: true
        }
    },
    required: ['title', 'description']
};
