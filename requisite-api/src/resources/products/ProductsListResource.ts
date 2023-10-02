import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { compare } from '@requisite/utils/lib/lang/StringUtils';
import type Product from '@requisite/model/lib/product/Product';

const logger = getLogger('resources/products/ProductsListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing products list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.organization, 'req.organization');
            const org = req.organization;
            const allProducts =
                await ServiceProvider.getProductsService().listProducts(org);
            let products: Product[];
            if (req.securityContext.systemAdmin) {
                products = allProducts;
            } else {
                // combine lists of public projects and ones that the user has
                // access to
                products = allProducts.filter(product => product.public).concat(
                    req.securityContext.productMemberships.map(
                        membership => membership.entity
                    )
                );
                // de-dupe the list
                products = products.filter((product, index) => {
                    const compareIndex = products.findIndex(
                        productToCompare => productToCompare.id === product.id
                    );
                    return compareIndex === index;
                });
            }
            // Sort the list by name
            products.sort((a: Product, b: Product) => {
                return compare(a.name, b.name);
            });
            res.status(200).send(products);
        } catch(error) {
            next(error);
        }
    })();
};
