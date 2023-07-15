import Entity from '../Entity';
import Product from './Product';
import Story from '../story/Story';

export default interface Feature extends Entity {

    product?: Product;
    name: string;
    description: string;
    stories?: Story[];
}

export const FeatureSchema: unknown = {
    title: 'Feature',
    description: 'Entity representing a feature',
    type: 'object',
    properties: {
        id: {
            type: 'number'
        },
        name: {
            type: 'string',
            isNotBlank: true
        },
        description: {
            type: 'string',
            isNotBlank: true
        }
    },
    required: ['name', 'description']
};
