import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/users/UsersDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing users delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            const id = parseInt(req.params.userId);
            await ServiceProvider.getUsersService().deleteUser(id);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
