import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgMembershipsListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const org = req.organization;
            const memberships
                = await ServiceProvider.getOrganizationsService().listMemberships(org);
            res.status(200).send(memberships);
        } catch(error) {
            next(error);
        }
    })();
};
