import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import type AuthenticationResponse from '@requisite/model/lib/user/AuthenticationResponse';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type User from '@requisite/model/lib/user/User';

const logger = getLogger('resources/security/SecurityLoginResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    // The actual authentication check is handled by the authentication middleware
    // The middleware places a user object on the request if authentication is
    // successful.  This resource will just check to make sure that exists as a
    // final sanity check.
    try {
        logger.debug('Executing security login resource');
        assertExists(req.user, 'req.user');
        const authResponse: AuthenticationResponse = (req.user as User).expired
            ? { message: 'Credentials Expired' }
            : { message: 'Authenticated' };
        res.json(authResponse);
    } catch (error) {
        next(error);
    }
};
