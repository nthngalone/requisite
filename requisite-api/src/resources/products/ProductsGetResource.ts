import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/ProductsGetResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products get resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            res.status(200).send(req.product);
        } catch(error) {
            next(error);
        }
    })();
};
