import { Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import ResourceRequest from './ResourceRequest';
import { assertExists } from '@requisite/utils/lib/validation/AssertionUtils';
import Entity from '@requisite/model/lib/Entity';
import { NotFoundError } from '../util/ApiErrors';

const logger = getLogger('common/ResourceEntityHandler');

const getEntityHandler = (
    entityName: string,
    entityIdParam: string,
    contextIdParams: string[],
    lookupEntity: (
        entityId: number,
        contextIds: Record<string, number>
    ) => Promise<Entity>
) => {
    return function(req: ResourceRequest, res: Response, next: NextFunction): void {
        (async function() {
            try {
                assertExists(req.params[entityIdParam], `req.params.${entityIdParam}`);
                const entityId = parseInt(req.params[entityIdParam]);

                const contextIds: Record<string, number> = {};
                contextIdParams.forEach((contextIdParam) => {
                    assertExists(req.params[contextIdParam], `req.params.${contextIdParam}`);
                    contextIds[contextIdParam] = parseInt(req.params[contextIdParam]);
                });
                const entity = await lookupEntity(entityId, contextIds);
                if (entity) {
                    logger.debug(`Found ${entityName} [${entityId}]: `, entity);
                    req.entity = entity;
                    next();
                } else {
                    next(new NotFoundError(`${entityName} [${entityId}] not found`));
                }
            } catch(error) {
                next(error);
            }
        })();
    };
};

export { getEntityHandler };
