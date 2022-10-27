import axios  from 'axios';
import fs from 'fs';
import ejs from 'ejs';
import {
    configure as configureLog4Js,
    getLogger as getLog4JsLogger,
    Logger
} from 'log4js';

let logger: Logger;

export function getLogger(): Logger {
    if (!logger) {
        configureLog4Js({
            appenders: {
                console: {
                    type: 'stdout'
                }
            },
            categories: {
                default: {
                    level: process.env.PIPELINE_LOG_LEVEL || 'INFO',
                    appenders: ['console']
                }
            }
        });
        logger = getLog4JsLogger('pipeline');
    }
    return logger;
}

export function wait(waitTimeMs: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, waitTimeMs);
    });
}

export async function waitUntil(
    description: string,
    untilTrue: () => Promise<boolean>,
    timeoutMs=60000,
    waitIterationTimeMs=2000
): Promise<void> {
    let finishedWaiting = false;
    const startTime = (new Date()).getTime();
    while(!finishedWaiting) {
        await wait(waitIterationTimeMs);
        finishedWaiting = await untilTrue();
        const currTime = (new Date()).getTime();
        if (currTime - startTime > timeoutMs) {
            throw new Error(`waitUntil [${description}] timed out!`);
        }
    }
}

export function pingApp(name: string, url: string, dataToCheck?: string): Promise<void> {
    return waitUntil(`pingApp for ${name} - ${url}`, async () => {
        const { status, data } = await axios.get(url, { validateStatus: () => true });
        return status === 200 &&
            (!dataToCheck || JSON.stringify(data).includes(dataToCheck));
    }, 60000, 5000);
}

export function writeFile(path: string, content: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(path, content, (writeErr) => {
            if (writeErr) {
                reject(writeErr);
            } else {
                resolve();
            }
        });
    });
}

export function removeFile(path: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        fs.rm(path, (removeErr) => {
            if (removeErr) {
                reject(removeErr);
            } else {
                resolve();
            }
        });
    });
}

export function renderTemplate(
    templatePath: string,
    data: Record<string, unknown>
): Promise<string> {
    return new Promise((resolve, reject) => {
        ejs.renderFile(templatePath, data, {}, function(renderErr, content){
            if (renderErr) {
                reject(renderErr);
            } else {
                resolve(content);
            }
        });
    });
}
