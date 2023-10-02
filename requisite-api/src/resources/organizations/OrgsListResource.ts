import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgsListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing orgs list resource');
            assertExists(req.securityContext, 'req.securityContext');
            const orgs = req.securityContext.systemAdmin
                ? await ServiceProvider.getOrganizationsService().listOrgs()
                : req.securityContext.orgMemberships.map(membership => membership.entity);
            res.status(200).send(orgs);
        } catch(error) {
            next(error);
        }
    })();
};
