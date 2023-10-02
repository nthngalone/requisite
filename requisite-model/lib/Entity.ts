import type User from './user/User';

export default interface Entity {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: User;
}

export const EntityIdentifierSchema: unknown = {
    title: 'Entity Identifier',
    description: 'Properties that identify an entity',
    type: 'object',
    properties: {
        id: {
            type: 'number'
        }
    },
    required: ['id']
};
