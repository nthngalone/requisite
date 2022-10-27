/* eslint-disable @typescript-eslint/no-empty-interface */
import Membership from './Membership';

export interface System { }

export default interface SystemAdmin extends Membership<System> { }

export const SystemAdminUserSchema: unknown = {
    title: 'SystemAdminUser',
    description: 'User object to represent a system admin',
    type: 'object',
    properties: {
        id: {
            type: 'number'
        }
    },
    required: ['id']
};
