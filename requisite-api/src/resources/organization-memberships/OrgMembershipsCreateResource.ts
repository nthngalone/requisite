import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Membership from '@requisite/model/lib/user/Membership';

const logger = getLogger('resources/organizations/OrgMembershipsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships create resource');
            assertExists(req.securityContext, 'req.securityContext');
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
