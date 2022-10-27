import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Organization from '@requisite/model/lib/org/Organization';

const logger = getLogger('resources/organizations/OrgsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing orgs delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            const id = parseInt(req.params.orgId);
            await ServiceProvider.getOrganizationsService()
                .deleteOrg({ id } as Organization);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
