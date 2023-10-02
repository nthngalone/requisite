import type { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import type ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotAuthorizedError } from '../util/ApiErrors';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logger = getLogger('common/ResourceSystemAdminOnlyHandler');

const getSystemAdminOnlyHandler = () => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.securityContext, 'req.securityContext');
                if (req.securityContext.systemAdmin) {
                    next();
                } else {
                    next(new NotAuthorizedError());
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getSystemAdminOnlyHandler };
