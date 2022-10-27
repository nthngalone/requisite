import { Request, Response, NextFunction } from 'express';
import { ApiError, SystemError, BadRequestError, ConflictError } from '../util/ApiErrors';
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
                    (resourceError as SystemError).error
                );
            }
            res.status(resourceError.statusCode);
            if (resourceError instanceof BadRequestError
                && (resourceError as BadRequestError).validationResult) {
                res.json((resourceError as BadRequestError).validationResult);
            } else if (resourceError instanceof ConflictError
                && (resourceError as ConflictError).conflictReason) {
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
