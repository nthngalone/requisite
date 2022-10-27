import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../util/ApiErrors';

const getNotFoundHandler = () => {
    return function(req: Request, res: Response, next: NextFunction): void {
        next(new NotFoundError());
    };
};

export { getNotFoundHandler };
