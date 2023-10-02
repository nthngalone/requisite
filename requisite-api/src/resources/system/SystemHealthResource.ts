import { getLogger } from '../../util/Logger';
import type ResourceRequest from '../../common/ResourceRequest';
import type { Response } from 'express';

const logger = getLogger('resources/system/SystemHealthResource');

export default (req: ResourceRequest, res: Response): void => {
    logger.debug('Executing system health resource');
    res.json(true);
};
