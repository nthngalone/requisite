import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../util/Logger';

const logger = getLogger('http');

const getAuditHandler = () => {
    return function(req: Request, res: Response, next: NextFunction): void {
        const startTimestamp: number = new Date().getTime();
        res.on('finish', () => {
            const endTimestamp: number = new Date().getTime();
            const duration = endTimestamp - startTimestamp;
            // TODO gather and log other information
            // ideas:
            //  - user name
            //  - client ip
            logger.info(`${res.statusCode} - ${req.method} ${req.originalUrl} - ${duration}ms`);
        });
        next();
    };
};

export { getAuditHandler };
