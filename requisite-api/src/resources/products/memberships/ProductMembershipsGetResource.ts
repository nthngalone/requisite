import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/memberships/ProductMembershipsGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product memberships get resource');
            assertExists(req.entity, 'req.entity');
            res.status(200).send(req.entity);
        } catch(error) {
            next(error);
        }
    })();
};
