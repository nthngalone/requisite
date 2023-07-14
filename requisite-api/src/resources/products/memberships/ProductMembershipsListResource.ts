import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/memberships/ProductMembershipsListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products memberships list resource');
            assertExists(req.product, 'req.product');
            const memberships = await ServiceProvider
                .getProductsService()
                .listMemberships(req.product);
            res.status(200).send(memberships);
        } catch(error) {
            next(error);
        }
    })();
};
