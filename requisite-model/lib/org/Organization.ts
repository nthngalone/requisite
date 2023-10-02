import type Entity from '../Entity';
import type Product from '../product/Product';
import type Membership from '../user/Membership';

export default interface Organization extends Entity {

    name: string;
    memberships?: Membership<Organization>[];
    products?: Product[];
}

export const OrganizationSchema: unknown = {
    title: 'Organization',
    description: 'Entity representing an organization',
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
