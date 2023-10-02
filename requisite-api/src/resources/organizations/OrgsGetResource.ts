import { getLogger } from '../../util/Logger';
import { NotFoundError } from '../../util/ApiErrors';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/OrgsGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing orgs get resource');
            assertExists(req.securityContext, 'req.securityContext');
            const id = parseInt(req.params.orgId);
            const org = await ServiceProvider.getOrganizationsService()
                .getOrg(id);
            if (org) {
                res.status(200).send(org);
            } else {
                next(new NotFoundError());
            }
        } catch(error) {
            next(error);
        }
    })();
};
