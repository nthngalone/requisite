import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotFoundError } from '../../util/ApiErrors';

const logger = getLogger('resources/organizations/OrgMembershipsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships delete resource');
            assertExists(req.entity, 'req.entity');
            const id = parseInt(req.params.membershipId);
            const organizationsService = ServiceProvider.getOrganizationsService();
            const membership = await organizationsService.getMembership(id);
            if (membership && (membership.entity.id === req.organization.id)) {
                await organizationsService.removeMembership(membership);
                res.status(200).send();
            } else {
                next(new NotFoundError());
            }
        } catch(error) {
            next(error);
        }
    })();
};
