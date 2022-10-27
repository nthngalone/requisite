import { getLogger } from '../../util/Logger';
import RegistrationRequest from '@requisite/model/lib/user/RegistrationRequest';
import RegistrationResponse from '@requisite/model/lib/user/RegistrationResponse';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { SystemError } from '../../util/ApiErrors';

const logger = getLogger('resources/security/SecurityRegistrationResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try{
            logger.debug('Executing security registration resource');
            const regRequest: RegistrationRequest = req.body as RegistrationRequest;
            const user = await ServiceProvider.getSecurityService().register(regRequest);
            if (user) {
                logger.debug('Registration successful', user);
                req.user = user;
                const regResponse: RegistrationResponse = {
                    id: user.id,
                    message: 'Registered'
                };
                res.json(regResponse);
            } else {
                next(new SystemError(new Error('No valid user returned from registration')));
            }
        } catch(error) {
            next(error);
        }
    })();
};
