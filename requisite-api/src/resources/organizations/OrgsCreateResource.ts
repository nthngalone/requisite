import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import type Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing orgs create resource');
            assertExists(req.securityContext, 'req.securityContext');
            const newOrg: Organization = req.body as Organization;
            const org = await ServiceProvider.getOrganizationsService()
                .createOrg(newOrg);
            res.status(200).send(org);
        } catch(error) {
            next(error);
        }
    })();
};
