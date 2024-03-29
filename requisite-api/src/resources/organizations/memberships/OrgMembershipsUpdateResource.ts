import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import type Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Membership from '@requisite/model/lib/user/Membership';
import { ConflictError } from '../../../util/ApiErrors';

const logger = getLogger('resources/organizations/memberships/OrgMembershipsUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships create resource');
            assertExists(req.entity, 'req.entity');
            const membership = req.entity as Membership<Organization>;

            const modMembership: Membership<Organization>
                = req.body as Membership<Organization>;

            const membershipIdConflict =
                modMembership.id !== null
                && modMembership.id !== undefined
                && modMembership.id !== membership.id;

            const entityIdConfict =
                modMembership.entity
                && modMembership.entity.id !== null
                && modMembership.entity.id !== undefined
                && modMembership.entity.id !== membership.entity.id;

            const userIdConfict =
                modMembership.user
                && modMembership.user.id !== null
                && modMembership.user.id !== undefined
                && modMembership.user.id !== membership.user.id;

            if (membershipIdConflict) {
                next(new ConflictError('The membership identifier in the body does not match the uri.'));
            } else if (entityIdConfict) {
                next(new ConflictError('The entity identifier in the body does not match the entity on the membership from the uri.  Entities cannot be changed on a membership'));
            } else if (userIdConfict) {
                next(new ConflictError('The user identifier in the body does not match the user on the membership from the uri.  Users cannot be changed on a membership'));
            } else {
                modMembership.id = membership.id;
                modMembership.entity = membership.entity;
                modMembership.user = membership.user;
                await ServiceProvider.getOrganizationsService()
                    .updateMembership(modMembership);
                res.status(200).send(modMembership);
            }
        } catch(error) {
            next(error);
        }
    })();
};
