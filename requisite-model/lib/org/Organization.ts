import Entity from '../Entity';
import Product from '../product/Product';
import Membership from '../user/Membership';

export default interface Organization extends Entity {

    name: string;
    memberships?: Membership<Organization>[];
    products?: Product[];
}

export const OrganizationSchema: unknown = {
    title: 'Organization',
    description: 'Request object to login a user',
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
