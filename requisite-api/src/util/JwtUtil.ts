import jwt from 'jsonwebtoken';
import Chance from 'chance';
import type User from '@requisite/model/lib/user/User';
import { getLogger } from './Logger';
import type { StringValue } from 'ms';

const logger = getLogger('common/ResourceAuthenticationHandler');

// FIXME This logic for the JWT_SECRET needs to be replaced as this solution WILL NOT
// scale beyond 1 pod as a stateless service.
//
// Possibilities:
// - Move it to a k8s secret and have the deployment generate a random value
// - Move it to a shared service and have the service generate/cache the value.  The
//   service could also possibly update the value periodically (daily/hourly?)
const JWT_SECRET = new Chance().string({ length: 10});
const { API_JWT_EXPIRY = '15m' } = process.env;

const jwtSign = (user: User): string => {
    return jwt.sign(
        {
            user: {
                domain: user.domain,
                userName: user.userName
            }
        },
        JWT_SECRET,
        { expiresIn: API_JWT_EXPIRY as StringValue }
    );
};

const jwtVerify = (signedJwt: string): User => {
    try {
        const { user } = jwt.verify(signedJwt, JWT_SECRET) as { user: User };
        return user;
    } catch(error) {
        logger.debug('Invalid JWT token', error);
        return null;
    }
};

export { jwtSign, jwtVerify };
