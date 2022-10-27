import User from '@requisite/model/lib/user/User';
import { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Membership from '@requisite/model/lib/user/Membership';
import Organization from '@requisite/model/lib/org/Organization';
import Product from '@requisite/model/lib/product/Product';

const logger = getLogger('common/ResourceSecurityContextHandler');

const getSecurityContextHandler = () => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                const resourceConfigKey = `${req.method.toUpperCase()} ${req.originalUrl}`;
                logger.debug(`Looking up the user security context for '${resourceConfigKey}'`);
                assertExists(req.user, 'req.user');
                const user = req.user as User;
                const securityService = ServiceProvider.getSecurityService();
                const systemAdmin = await securityService.isSystemAdmin(user);
                let orgMemberships: Membership<Organization>[];
                let productMemberships: Membership<Product>[];
                if (!systemAdmin) {
                    [
                        orgMemberships,
                        productMemberships
                    ] = await Promise.all([
                        securityService.getOrgMemberships(user),
                        securityService.getProductMemberships(user)
                    ]);
                }
                req.securityContext = {
                    user,
                    orgMemberships,
                    productMemberships,
                    systemAdmin
                };
                next();
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getSecurityContextHandler };
