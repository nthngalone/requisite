import { getLogger } from '../../util/Logger';
import ResourceRequest from '../../common/ResourceRequest';
import { Response } from 'express';

const logger = getLogger('resources/system/SystemHealthResource');

export default (req: ResourceRequest, res: Response): void => {
    logger.debug('Executing system health resource');
    res.json(true);
};
