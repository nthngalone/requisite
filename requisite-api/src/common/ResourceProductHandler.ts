import type { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import type ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotAuthorizedError, NotFoundError } from '../util/ApiErrors';
import type Membership from '@requisite/model/lib/user/Membership';
import type { ProductRole } from '@requisite/model/lib/user/Membership';
import type Product from '@requisite/model/lib/product/Product';

const logger = getLogger('common/ResourceProductHandler');

async function lookupProduct(orgId: number, productId: number): Promise<Product> {
    logger.debug(`Looking up the product for product id [${productId}]`);
    const productsService = ServiceProvider.getProductsService();
    const product = await productsService.getProduct(productId);
    if (!product || product.organization.id !== orgId) {
        throw new NotFoundError(`Product [${productId}] not found for organization [${orgId}]`);
    }
    return product;
}

function checkPermissions(
    productMemberships: Membership<Product>[],
    product: Product,
    requiredRole: ProductRole
): void {
    const membership = productMemberships.find((productMembership) => {
        // returns true only if a membership for the entity is found
        // and if the optionally provided required role matches for
        // the membership
        return productMembership.entity.id === product.id
            && (
                !requiredRole
                || (
                    requiredRole
                    && productMembership.role === requiredRole
                )
            );
    });
    if (!membership) {
        throw new NotAuthorizedError();
    }
}

const getProductHandler = (requiredRole?: ProductRole) => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.organization, 'req.organization');
                assertExists(req.params.productId, 'req.params.productId');
                assertExists(req.securityContext, 'req.securityContext');
                const productId = parseInt(req.params.productId);
                const { systemAdmin, productMemberships } = req.securityContext;
                const product = await lookupProduct(req.organization.id, productId);
                const isPermissionCheckNeeded =
                    !systemAdmin
                    && (!product.public || requiredRole);
                if (isPermissionCheckNeeded) {
                    checkPermissions(productMemberships, product, requiredRole);
                }
                req.product = product;
                next();
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getProductHandler };
