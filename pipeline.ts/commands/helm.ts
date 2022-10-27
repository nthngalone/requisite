import { runCommand } from './command';

export function helmList(): Promise<string> {
    return runCommand('helm list');
}

export async function helmResourceExists(resourceName: string): Promise<boolean> {
    const list = await helmList();
    return list.includes(`requisite-${resourceName}`);
}

export function helmUninstall(resourceName: string): Promise<string> {
    return runCommand(`helm uninstall requisite-${resourceName} --wait`);
}

export function helmInstall(resourceName: string, resourceTag?: string): Promise<string> {
    const overrides = resourceTag ? `--set deployment.image.tag=${resourceTag}` : '';
    return runCommand(`helm install requisite-${resourceName} --values ./requisite-helm/values/requisite-${resourceName}/values.yaml ${overrides} ./requisite-helm`);
}
