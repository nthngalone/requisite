import { Router } from 'express';
import UsersListResource from './users/UsersListResource';
import UsersDeleteResource from './users/UsersDeleteResource';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getSystemAdminOnlyHandler } from '../common/ResourceSystemAdminOnlyHandler';

export const UserReqParamsSchema: unknown = {
    title: 'User Id Params',
    description: 'Request params for users',
    type: 'object',
    properties: {
        userId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['userId']
};

const getUsersResourceRouter = (): Router => {
    const usersResourceRouter = Router();
    usersResourceRouter.route('').get(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        UsersListResource
    );
    usersResourceRouter.route('/:userId').delete(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        getSystemAdminOnlyHandler(),
        getValidationHandler({
            paramsSchema: UserReqParamsSchema
        }),
        UsersDeleteResource
    );
    return usersResourceRouter;
};

export { getUsersResourceRouter };
