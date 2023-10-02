import { type Express } from 'express';
import { getApp } from './app';
import { init } from './initialization';
import type Logger from './util/Logger';
import { configure as logConfig, getLogger } from './util/Logger';
import { config } from 'dotenv';

config({ path: '../.env' });

const { API_LOG_LEVEL, API_PORT } = process.env;

logConfig(API_LOG_LEVEL);
const logger: Logger = getLogger('index');
const app: Express = getApp();

const port = parseInt(API_PORT);
init().then(() => {
    app.listen(port, '0.0.0.0', () => {
        logger.info(`Requisite API listening at: http://localhost:${port}`);
        logger.info(`Log level: ${API_LOG_LEVEL}`);
    });
}).catch((error) => {
    logger.fatal('A fatal error occurred during initialization', error);
});
