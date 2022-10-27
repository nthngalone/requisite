import User from '../user/User';
import Entity from '../Entity';
import Organization from '../org/Organization';
import Feature from './Feature';
import Constituent from './Constituent';
import Membership from '../user/Membership';

export default interface Product extends Entity {

    organization?: Organization;
    name: string;
    description: string;
    primaryContact: User;
    constituents?: Constituent[];
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
        }
    },
    required: ['name']
};
