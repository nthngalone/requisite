import type User from '@requisite/model/lib/user/User';
import type { Request, RequestHandler, Response } from 'express';
import { jwtSign } from '../util/JwtUtil';
import { getLogger } from '../util/Logger';
import mung from 'express-mung';

const logger = getLogger('common/ResourceJwtResponseHandler');

function getJwtResponseHandler(): RequestHandler {
    return mung.headers((
        req: Request,
        res: Response
    ): void => {
        if (req.user) {
            logger.debug('Adding JWT token to response');
            const token = jwtSign(req.user as User);
            res.setHeader('X-Authorization', token);
        } else {
            logger.debug('Not adding JWT token to response');
        }
    });
}

export { getJwtResponseHandler };
