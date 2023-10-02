import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import type Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Membership from '@requisite/model/lib/user/Membership';

const logger = getLogger('resources/organizations/memberships/OrgMembershipsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships create resource');
            assertExists(req.organization, 'req.organization');
            const newMembership: Membership<Organization>
                = req.body as Membership<Organization>;
            newMembership.entity = req.organization;
            const membership = await ServiceProvider.getOrganizationsService()
                .addMembership(newMembership);
            res.status(200).send(membership);
        } catch(error) {
            next(error);
        }
    })();
};
