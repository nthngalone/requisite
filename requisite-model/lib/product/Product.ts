import Entity from '../Entity';
import Organization from '../org/Organization';
import Feature from './Feature';
import Membership from '../user/Membership';
import Persona from './Persona';

export default interface Product extends Entity {

    organization?: Organization;
    name: string;
    description: string;
    public: boolean;
    personas?: Persona[];
    features?: Feature[];
    memberships?: Membership<Product>[];
}

export const ProductSchema: unknown = {
    title: 'Product',
    description: 'Entity representing a product',
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
        public: {
            type: 'boolean'
        }
    },
    required: ['name', 'description', 'public']
};
