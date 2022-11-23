import User from './User';
import Entity, { EntityIdentifierSchema } from '../Entity';

export default interface Membership<T> extends Entity {
    user: User;
    entity: T;
    role: SystemRole | OrganizationRole | ProductRole;
}

export enum SystemRole {
    ADMIN = 'ADMIN'
}

export enum OrganizationRole {
    OWNER = 'OWNER',
    MEMBER = 'MEMBER'
}

export enum ProductRole {
    OWNER = 'OWNER',
    STAKEHOLDER = 'STAKEHOLDER',
    CONTRIBUTOR = 'CONTRIBUTOR'
}

export const MembershipSchema: unknown = {
    title: 'Membership',
    description: 'Entity representing a membership',
    type: 'object',
    properties: {
        id: {
            type: 'number'
        },
        user: EntityIdentifierSchema,
        entity: EntityIdentifierSchema,
        role: {
            type: 'string',
            isNotBlank: true
        }
    },
    required: ['user', 'entity', 'role']
};
