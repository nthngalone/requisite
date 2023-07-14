import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Organization from '@requisite/model/lib/org/Organization';
import Membership from '@requisite/model/lib/user/Membership';

const logger = getLogger('resources/organizations/memberships/OrgMembershipsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships delete resource');
            assertExists(req.entity, 'req.entity');
            const membership = req.entity as Membership<Organization>;
            await ServiceProvider
                .getOrganizationsService()
                .removeMembership(membership);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
