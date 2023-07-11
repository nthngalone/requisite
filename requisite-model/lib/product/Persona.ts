import Entity from '../Entity';
import Product from './Product';

export default interface Persona extends Entity {

    product: Product;
    name: string;
    description: string;
    avatar: string;
}

export const PersonaSchema: unknown = {
    title: 'Persona',
    description: 'Entity representing a persona',
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
        },
        avatar: {
            type: 'string',
            isNotBlank: true
        }
    },
    required: ['name', 'description', 'avatar']
};
