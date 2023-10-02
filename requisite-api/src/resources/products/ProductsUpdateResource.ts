import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Product from '@requisite/model/lib/product/Product';

const logger = getLogger('resources/products/ProductsUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products update resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            assertExists(req.product, 'req.product');
            const modProduct: Product = req.body as Product;
            const productsService = ServiceProvider.getProductsService();
            modProduct.id = req.product.id;
            modProduct.organization = req.product.organization;
            await productsService.updateProduct(modProduct);
            res.status(200).send(modProduct);
        } catch(error) {
            next(error);
        }
    })();
};
