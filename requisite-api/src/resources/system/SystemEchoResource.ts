import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response } from 'express';

const logger = getLogger('resources/system/SystemEchoResource');

export default (req: ResourceRequest, res: Response): void => {
    logger.debug('Executing system echo resource');
    res.json({
        headers: req.headers,
        body: req.body
    });
};
