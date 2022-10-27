import jwt from 'jsonwebtoken';
import random from 'crypto-random-string';
import User from '@requisite/model/lib/user/User';
import { getLogger } from './Logger';

const logger = getLogger('common/ResourceAuthenticationHandler');

const JWT_SECRET = random({ length: 10}); // TODO have this periodically refresh
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
        { expiresIn: API_JWT_EXPIRY }
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
