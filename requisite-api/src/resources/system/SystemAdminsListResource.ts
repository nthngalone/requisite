import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/system/SystemAdminListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing system admins list resource');
            assertExists(req.securityContext, 'req.securityContext');
            const sysAdmins = await ServiceProvider.getSystemService()
                .listSystemAdmins();
            res.status(200).send(sysAdmins);
        } catch(error) {
            next(error);
        }
    })();
};
