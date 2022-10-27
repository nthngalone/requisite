import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/ProductsDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            const productsService = ServiceProvider.getProductsService();
            productsService.deleteProduct(req.product);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
