import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/system/SystemAdminsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing system admins delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            const id = parseInt(req.params.id);
            await ServiceProvider.getSystemService()
                .removeSystemAdmin(id);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
