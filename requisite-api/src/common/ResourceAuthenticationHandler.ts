import type User from '@requisite/model/lib/user/User';
import type { Request, Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import { jwtVerify } from '../util/JwtUtil';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import ServiceProvider from '../services/ServiceProvider';
import type SecurityService from '../services/SecurityService';
import { NotAuthenticatedError } from '../util/ApiErrors';

const logger = getLogger('common/ResourceAuthenticationHandler');

passport.use(new LocalStrategy({
    usernameField: 'userName',
    passReqToCallback: true
}, function(req, userName, password, done) {
    const securityService: SecurityService = ServiceProvider.getSecurityService();
    const notAuthenticatedMessage = 'Please provide a valid user name and password';
    (async function() {
        try {
            // default to 'local' if a domain is not specified
            const domain = req.body.domain || 'local';
            const user: User = await securityService.login({
                domain,
                userName,
                password
            });
            if (user && !user.revoked) {
                return done(null, user);
            } else {
                logger.debug('Failing authentication, user is either invalid or revoked: ', user);
                return done(null, false, { message: notAuthenticatedMessage });
            }
        } catch(error) {
            if (error instanceof NotAuthenticatedError) {
                return done(null, false, { message: notAuthenticatedMessage });
            } else {
                return done(error);
            }
        }
    })();
}));

passport.use(new BearerStrategy(async function(token, done) {
    const user: User = jwtVerify(token);
    if (user) {
        try {
            logger.debug(`Retrieved user '${user.domain}/${user.userName}' from validated JWT`);
            const validatedUser = await ServiceProvider.getUsersService().getUser(
                { domain: user.domain, userName: user.userName }
            );
            if (validatedUser && !validatedUser.revoked) {
                return done(null, validatedUser);
            } else {
                logger.debug('Failing authentication, user is either invalid or revoked: ', validatedUser);
                return done(null, false);
            }
        } catch (error) {
            return done(error);
        }
    } else {
        return done(null, false);
    }
}));

const getAuthenticationHandler = (strategy: string) => {
    return function(req: Request, res: Response, next: NextFunction): void {
        const resourceConfigKey = `${req.method.toUpperCase()} ${req.originalUrl}`;
        logger.debug(`Authenticating '${resourceConfigKey}' with ${strategy} passport strategy.`);
        passport.authenticate(
            strategy,
            { session: false }
        )(req, res, next);
    };
};

export { getAuthenticationHandler };
