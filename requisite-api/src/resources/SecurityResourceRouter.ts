import { Router } from 'express';
import SecurityLoginResource from './security/SecurityLoginResource';
import SecurityRegistrationResource from './security/SecurityRegistrationResource';
import SecurityStatusResource from './security/SecurityStatusResource';
import SecurityContextResource from './security/SecurityContextResource';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { RegistrationRequestSchema } from '@requisite/model/lib/user/RegistrationRequest';
import { AuthenticationRequestSchema } from '@requisite/model/lib/user/AuthenticationRequest';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';


const getSecurityResourceRouter = (): Router => {
    const securityResourceRouter = Router();
    securityResourceRouter.route('/register').post(
        getValidationHandler({ bodySchema: RegistrationRequestSchema }),
        SecurityRegistrationResource
    );
    securityResourceRouter.route('/login').post(
        getValidationHandler({ bodySchema: AuthenticationRequestSchema }),
        getAuthenticationHandler('local'),
        SecurityLoginResource
    );
    securityResourceRouter.route('/status').get(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        SecurityStatusResource
    );
    securityResourceRouter.route('/context').get(
        getAuthenticationHandler('bearer'),
        getSecurityContextHandler(),
        SecurityContextResource
    );
    return securityResourceRouter;
};

export { getSecurityResourceRouter };
