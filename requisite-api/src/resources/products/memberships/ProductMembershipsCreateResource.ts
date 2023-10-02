import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Membership from '@requisite/model/lib/user/Membership';
import type Product from '@requisite/model/lib/product/Product';

const logger = getLogger('resources/products/memberships/ProductMembershipsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product memberships create resource');
            assertExists(req.product, 'req.product');
            const newMembership: Membership<Product>
                = req.body as Membership<Product>;
            newMembership.entity = req.product;
            const membership = await ServiceProvider.getProductsService()
                .addMembership(newMembership);
            res.status(200).send(membership);
        } catch(error) {
            next(error);
        }
    })();
};
