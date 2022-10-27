import User from './User';
import Entity from '../Entity';

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
