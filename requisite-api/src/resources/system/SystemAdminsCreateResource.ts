import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import User from '@requisite/model/lib/user/User';
import SystemAdmin from '@requisite/model/lib/user/SystemAdmin';

const logger = getLogger('resources/system/SystemAdminsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing system admins create resource');
            assertExists(req.securityContext, 'req.securityContext');
            const user: User = req.body as User;
            const sysAdmin: SystemAdmin = await ServiceProvider.getSystemService()
                .addSystemAdmin(user);
            res.status(200).send(sysAdmin);
        } catch(error) {
            next(error);
        }
    })();
};
