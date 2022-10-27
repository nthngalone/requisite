import { exec } from 'child_process';
import { getLogger }  from '../utils';

export function runCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        getLogger().debug(`> ${command}`);
        exec(command, (err, stdout, stderr) => {
            getLogger().debug(stdout);
            if (err) {
                getLogger().error(stderr);
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}
