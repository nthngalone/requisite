import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import type Organization from '@requisite/model/lib/org/Organization';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgsUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing orgs update resource');
            assertExists(req.securityContext, 'req.securityContext');
            const id = parseInt(req.params.orgId);
            const modOrg: Organization = req.body as Organization;
            modOrg.id = id;
            const org = await ServiceProvider.getOrganizationsService()
                .updateOrg(modOrg);
            res.status(200).send(org);
        } catch(error) {
            next(error);
        }
    })();
};
