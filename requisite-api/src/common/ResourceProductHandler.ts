import { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ServiceProvider from '../services/ServiceProvider';
import ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { NotAuthorizedError, NotFoundError } from '../util/ApiErrors';
import { ProductRole } from '@requisite/model/lib/user/Membership';

const logger = getLogger('common/ResourceProductHandler');

const getProductHandler = (requiredRole?: ProductRole) => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.organization, 'req.organization');
                assertExists(req.params.productId, 'req.params.productId');
                assertExists(req.securityContext, 'req.securityContext');
                const productId = parseInt(req.params.productId);
                const { systemAdmin, productMemberships } = req.securityContext;
                const allowed =
                    systemAdmin || productMemberships.find((productMembership) => {
                        // returns true only if a membership for the entitiy is found
                        // and if the optionally provided required role matches for
                        // the membership
                        return productMembership.entity.id === productId
                            && (
                                !requiredRole
                                || (
                                    requiredRole
                                    && productMembership.role === requiredRole
                                )
                            );
                    });
                if (allowed) {
                    logger.debug(`Looking up the product for product id [${req.params.productId}]`);
                    const productsService = ServiceProvider.getProductsService();
                    req.product = await productsService.getProduct(productId);
                    if (req.product
                        && req.product.organization.id === req.organization.id) {
                        next();
                    } else {
                        next(new NotFoundError(`Product [${req.params.productId}] not found for organization [${req.params.orgId}]`));
                    }
                } else {
                    next(new NotAuthorizedError());
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getProductHandler };
