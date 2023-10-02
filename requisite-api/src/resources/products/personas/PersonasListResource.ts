import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';

const logger = getLogger('resources/products/personas/PersonasListResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing product personas list resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.product, 'req.product');
            const product = req.product;
            const personas = await ServiceProvider
                .getPersonasService()
                .listPersonas(product);
            res.status(200).send(personas);
        } catch(error) {
            next(error);
        }
    })();
};
