import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/users/UsersListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing users list resource');
            assertExists(req.securityContext, 'req.securityContext');
            const users = await ServiceProvider.getUsersService().listUsers();
            res.status(200).send(users);
        } catch(error) {
            next(error);
        }
    })();
};
