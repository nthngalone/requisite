import { getLogger } from '../../util/Logger';
import { NotFoundError } from '../../util/ApiErrors';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgMembershipsGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships get resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const id = parseInt(req.params.membershipId);
            const membership = await ServiceProvider.getOrganizationsService()
                .getMembership(id);
            if (membership && (membership.entity.id === req.organization.id)) {
                res.status(200).send(membership);
            } else {
                next(new NotFoundError());
            }
        } catch(error) {
            next(error);
        }
    })();
};
