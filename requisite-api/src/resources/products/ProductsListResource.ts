import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/ProductsListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const org = req.organization;
            const products = req.securityContext.systemAdmin
                ? await ServiceProvider.getProductsService().listProducts(org)
                : req.securityContext.productMemberships.map(
                    membership => membership.entity
                );
            res.status(200).send(products);
        } catch(error) {
            next(error);
        }
    })();
};
