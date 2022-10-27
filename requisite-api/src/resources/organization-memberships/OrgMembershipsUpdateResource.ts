import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Membership from '@requisite/model/lib/user/Membership';
import { NotFoundError } from '../../util/ApiErrors';

const logger = getLogger('resources/organizations/OrgMembershipsUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships create resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const id = parseInt(req.params.membershipId);
            const organizationsService = ServiceProvider.getOrganizationsService();
            const membership = await organizationsService.getMembership(id);
            if (membership && membership.entity.id === req.organization.id) {
                const modMembership: Membership<Organization>
                    = req.body as Membership<Organization>;
                modMembership.id = id;
                modMembership.entity = req.organization;
                await organizationsService.updateMembership(modMembership);
                res.status(200).send(modMembership);
            } else {
                next(new NotFoundError());
            }
        } catch(error) {
            next(error);
        }
    })();
};
