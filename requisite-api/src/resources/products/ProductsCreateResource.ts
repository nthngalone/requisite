import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Product from '@requisite/model/lib/product/Product';

const logger = getLogger('resources/products/ProductsCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products create resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const newProduct: Product = req.body as Product;
            newProduct.organization = req.organization;
            const product = await ServiceProvider.getProductsService()
                .createProduct(newProduct);
            res.status(200).send(product);
        } catch(error) {
            next(error);
        }
    })();
};
