import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';
import { validate, ValidationResult } from '@requisite/utils/lib/validation/ValidationUtils';
import { BadRequestError } from '../util/ApiErrors';

const logger = getLogger('common/ResourceValidationHandler');

const getValidationHandler = ({ paramsSchema, bodySchema }:
    { paramsSchema?: unknown, bodySchema?: unknown}) => {
    return function(req: Request, res: Response, next: NextFunction): void {
        const results: { params?: ValidationResult, body?: ValidationResult} = {};
        if (paramsSchema) {
            results.params = validate(
                req.params,
                paramsSchema
            );
        }
        if (bodySchema) {
            results.body = validate(
                req.body,
                bodySchema
            );
        }
        const valid = (!paramsSchema || (paramsSchema && results.params.valid))
            && (!bodySchema || (bodySchema && results.body.valid));
        if (valid) {
            logger.debug(`Validation for '${req.method.toUpperCase()} ${req.originalUrl}' was successful.`);
            next();
        } else {
            const errorResults = {
                valid,
                errors: {}
            } as ValidationResult;
            if (results.params && results.params.errors) {
                Object.keys(results.params.errors).forEach((key) => {
                    errorResults.errors[`path.${key}`] = results.params.errors[key];
                });
            }
            if (results.body && results.body.errors) {
                Object.keys(results.body.errors).forEach((key) => {
                    errorResults.errors[`body.${key}`] = results.body.errors[key];
                });
            }
            next(new BadRequestError(errorResults));
        }
    };
};

export { getValidationHandler };
