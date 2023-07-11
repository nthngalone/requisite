import { getLogger } from '../../../util/Logger';
import ResourceRequest from '../../../common/ResourceRequest';
import { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Persona from '@requisite/model/lib/product/Persona';

const logger = getLogger('resources/products/personas/PersonasCreateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing personas create resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.product, 'req.product');
            const newPersona: Persona = req.body as Persona;
            newPersona.product = req.product;
            const persona = await ServiceProvider.getPersonasService()
                .createPersona(newPersona);
            res.status(200).send(persona);
        } catch(error) {
            next(error);
        }
    })();
};
