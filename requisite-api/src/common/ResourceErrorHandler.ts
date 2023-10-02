import type { Request, Response, NextFunction } from 'express';
import type { ApiError } from '../util/ApiErrors';
import { SystemError, BadRequestError, ConflictError } from '../util/ApiErrors';
import { getLogger } from '../util/Logger';

const logger = getLogger('ResourceErrorHandler');

const getErrorHandler = () => {
    return (
        err: ApiError | Error,
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {

        if ((err as ApiError).statusCode && (err as ApiError).message) {
            const resourceError = err as ApiError;
            if (resourceError instanceof SystemError) {
                logger.error(
                    'A system error was encountered',
                    resourceError.error
                );
            }
            res.status(resourceError.statusCode);
            if (resourceError instanceof BadRequestError
                && resourceError.validationResult) {
                res.json(resourceError.validationResult);
            } else if (resourceError instanceof ConflictError
                && resourceError.conflictReason) {
                res.json({ ...resourceError });
            } else {
                res.send(resourceError.message);
            }
        } else {
            logger.error(
                'An unexpected error was encountered',
                err
            );
            next(err);
        }
    };
};

export { getErrorHandler };
