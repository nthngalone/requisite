import { runCommand } from './command';

export async function npmInstall(): Promise<void> {
    await runCommand('npm install');
}

export async function npmRun(scriptName: string): Promise<void> {
    await runCommand(`npm run ${scriptName}`);
}
