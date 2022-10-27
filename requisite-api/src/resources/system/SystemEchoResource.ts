import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response } from 'express';

const logger = getLogger('resources/system/SystemEchoResource');

export default (req: ResourceRequest, res: Response): void => {
    logger.debug('Executing system echo resource');
    res.json({
        headers: req.headers,
        body: req.body
    });
};
