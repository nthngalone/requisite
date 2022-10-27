import { Router } from 'express';
import SystemHealthResource from './system/SystemHealthResource';
import SystemEchoResource from './system/SystemEchoResource';
import SystemAdminsListResource from './system/SystemAdminsListResource';
import SystemAdminsCreateResource from './system/SystemAdminsCreateResource';
import SystemAdminsDeleteResource from './system/SystemAdminsDeleteResource';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { SystemAdminUserSchema } from '@requisite/model/lib/user/SystemAdmin';

export const SysAdminIdParamsSchema: unknown = {
    title: 'System Admins Id Params',
    description: 'Request params for system admins id',
    type: 'object',
    properties: {
        id: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['id']
};

const getSystemResourceRouter = (): Router => {
    const systemResourceRouter = Router();
    systemResourceRouter.route('/health').get(SystemHealthResource);
    systemResourceRouter.route('/echo').get(SystemEchoResource);
    systemResourceRouter.route('/admins').get(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        SystemAdminsListResource
    );
    systemResourceRouter.route('/admins').post(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        getValidationHandler({
            bodySchema: SystemAdminUserSchema
        }),
        SystemAdminsCreateResource
    );
    systemResourceRouter.route('/admins/:id').delete(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        getValidationHandler({
            paramsSchema: SysAdminIdParamsSchema
        }),
        SystemAdminsDeleteResource
    );
    return systemResourceRouter;
};

export { getSystemResourceRouter };
