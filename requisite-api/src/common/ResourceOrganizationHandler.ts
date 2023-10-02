import type { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import type ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotAuthorizedError, NotFoundError } from '../util/ApiErrors';
import { OrganizationRole } from '@requisite/model/lib/user/Membership';

const logger = getLogger('common/ResourceOrganizationHandler');

const getOrganizationHandler = (requiredRole?: OrganizationRole) => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.params.orgId, 'req.params.orgId');
                assertExists(req.securityContext, 'req.securityContext');
                const orgId = parseInt(req.params.orgId);
                const { systemAdmin, orgMemberships } = req.securityContext;
                const allowed = systemAdmin || orgMemberships.find((orgMembership) => {
                    // returns true only if a membership for the entitiy is found and
                    // if the optionally provided required role matches for the membership
                    return orgMembership.entity.id === orgId
                        && (
                            !requiredRole
                            || (requiredRole && orgMembership.role === requiredRole)
                        );
                });
                if (allowed) {
                    logger.debug(`Looking up the organization for org id [${req.params.orgId}]`);
                    const orgService = ServiceProvider.getOrganizationsService();
                    req.organization = await orgService.getOrg(orgId);
                    if (req.organization) {
                        next();
                    } else {
                        next(new NotFoundError(`Organization [${req.params.orgId}] not found`));
                    }
                } else {
                    next(new NotAuthorizedError());
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getOrganizationHandler };
