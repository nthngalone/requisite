import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/organizations/memberships/OrgMembershipsGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing org memberships get resource');
            assertExists(req.entity, 'req.entity');
            res.status(200).send(req.entity);
        } catch(error) {
            next(error);
        }
    })();
};
