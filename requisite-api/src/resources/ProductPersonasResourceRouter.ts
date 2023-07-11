import { Router } from 'express';
import { getAuthenticationHandler } from '../common/ResourceAuthenticationHandler';
import { getValidationHandler } from '../common/ResourceValidationHandler';
import { getSecurityContextHandler } from '../common/ResourceSecurityContextHandler';
import { getOrganizationHandler } from '../common/ResourceOrganizationHandler';
import { ProductRole } from '@requisite/model/lib/user/Membership';
import PersonasListResource from './products/personas/PersonasListResource';
import PersonasUpdateResource from './products/personas/PersonasUpdateResource';
import PersonasGetResource from './products/personas/PersonasGetResource';
import PersonasCreateResource from './products/personas/PersonasCreateResource';
import PersonasDeleteResource from './products/personas/PersonasDeleteResource';
import { getEntityHandler } from '../common/ResourceEntityHandler';
import ServiceProvider from '../services/ServiceProvider';
import { getProductHandler } from '../common/ResourceProductHandler';
import { PersonaSchema } from '@requisite/model/lib/product/Persona';

export const ProductPersonaReqParamsSchema: unknown = {
    title: 'Product Persona Id Params',
    description: 'Request params for product personas',
    type: 'object',
    properties: {
        personaId: {
            type: 'string',
            pattern: '[0-9]+'
        }
    },
    required: ['personaId']
};

const productPersonaEntityHandler = getEntityHandler(
    'persona',
    'personaId',
    ['productId'],
    async (entityId: number, contextIds: Record<string, number>) => {
        const persona = await ServiceProvider
            .getPersonasService()
            .getPersona(entityId);
        return (persona
            && persona.product.id === contextIds.productId)
            ? persona
            : null;
    }
);

const getProductPersonasResourceRouter = (): Router => {

    const productPersonasResourceRouter = Router({ mergeParams: true });

    productPersonasResourceRouter.route('')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(),
            PersonasListResource
        )
        .post(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            getValidationHandler({
                bodySchema: PersonaSchema
            }),
            PersonasCreateResource
        );

    productPersonasResourceRouter.route('/:personaId')
        .get(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductPersonaReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(),
            productPersonaEntityHandler,
            PersonasGetResource
        )
        .put(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductPersonaReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            productPersonaEntityHandler,
            getValidationHandler({
                bodySchema: PersonaSchema
            }),
            PersonasUpdateResource
        )
        .delete(
            getAuthenticationHandler('bearer'),
            getSecurityContextHandler(),
            getValidationHandler({
                paramsSchema: ProductPersonaReqParamsSchema
            }),
            getOrganizationHandler(),
            getProductHandler(ProductRole.OWNER),
            productPersonaEntityHandler,
            PersonasDeleteResource
        );
    return productPersonasResourceRouter;
};

export { getProductPersonasResourceRouter };
