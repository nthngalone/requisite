import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { NextFunction, Response } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/security/SecurityStatusResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    try {
        logger.debug('Executing security status resource');
        assertExists(req.securityContext, 'req.securityContext');
        res.json(true);
    } catch(error) {
        next(error);
    }
};
