import { getLogger } from '../../../util/Logger';
import type ResourceRequest from '../../../common/ResourceRequest';
import type { Response, NextFunction } from 'express';
import ServiceProvider from '../../../services/ServiceProvider';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import type Persona from '@requisite/model/lib/product/Persona';

const logger = getLogger('resources/products/personas/PersonasDeleteResource');

export default (req: ResourceRequest, res: Response, next: NextFunction): void => {
    (async function() {
        try {
            logger.debug('Executing personas delete resource');
            assertExists(req.securityContext, 'req.securityContext');
            assertExists(req.entity, 'req.entity');
            const personasService = ServiceProvider.getPersonasService();
            const persona = req.entity as Persona;
            await personasService.deletePersona(persona);
            res.status(200).send();
        } catch(error) {
            next(error);
        }
    })();
};
