import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import { ConflictError } from '../../../util/ApiErrors';
import type Persona from '@requisite/model/lib/product/Persona';

const logger = getLogger('resources/products/personas/PersonasUpdateResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing personas update resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.entity, 'req.entity');

            const persona = req.entity as Persona;
            const modPersona: Persona = req.body as Persona;

            const personaIdConflict =
                modPersona.id !== null
                && modPersona.id !== undefined
                && modPersona.id !== persona.id;

            const productIdConfict =
                modPersona.product
                && modPersona.product.id !== null
                && modPersona.product.id !== undefined
                && modPersona.product.id !== persona.product.id;

            if (personaIdConflict) {
                next(new ConflictError('The persona identifier in the body does not match the uri.'));
            } else if (productIdConfict) {
                next(new ConflictError('The product identifier in the body does not match the product identifier from the uri.  Product references on a persona cannot be changed.'));
            } else {
                modPersona.id = persona.id;
                modPersona.product = persona.product;
                const updatedPersona = await ServiceProvider
                    .getPersonasService()
                    .updatePersona(modPersona);
                res.status(200).send(updatedPersona);
            }
        } catch(error) {
            next(error);
        }
    })();
};
