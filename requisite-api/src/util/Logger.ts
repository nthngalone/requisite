import {
    configure as configureLog4Js,
    getLogger as getLog4JsLogger
} from 'log4js';

const getLogger = (name: string): Logger => {
    const log4jsLogger = getLog4JsLogger(name);
    return log4jsLogger as Logger;
};

// TODO support more granular levels
const configure = (level: string): void => {
    configureLog4Js({
        appenders: {
            console: {
                type: 'stdout'
            }
        },
        categories: {
            default: {
                level,
                appenders: ['console']
            }
        }
    });
};

export { configure, getLogger };

interface Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trace(message: string, data?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    debug(message: string, data?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    info(message: string, data?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warn(message: string, data?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error(message: string, data?: any): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fatal(message: string, data?: any): void;
}

export default Logger;
