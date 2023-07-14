import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Product from '@requisite/model/lib/product/Product';
import Membership from '@requisite/model/lib/user/Membership';

const logger = getLogger('resources/products/memberships/ProductMembershipsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product memberships delete resource');
            assertExists(req.entity, 'req.entity');
            const productsService = ServiceProvider.getProductsService();
            const membership = req.entity as Membership<Product>;
            await productsService.removeMembership(membership);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
