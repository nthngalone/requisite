import { runCommand } from './command';

export async function k8sPublishImage(resourceName: string, tag: string): Promise<void> {
    await runCommand(`minikube image rm requisite/${resourceName}:${tag}`);
    await runCommand(`minikube image load requisite/${resourceName}:${tag}`);
}

export function k8sGetPods(resourceName?: string): Promise<string> {
    const filter = resourceName ? `-l "app.kubernetes.io/name=requisite-${resourceName}"`: '';
    return runCommand(`minikube kubectl -- get pods ${filter}`);
}

export function k8sGetServices(resourceName?: string): Promise<string> {
    const filter = resourceName ? `-l "app.kubernetes.io/name=requisite-${resourceName}"`: '';
    return runCommand(`minikube kubectl -- get services ${filter}`);
}

export function k8sGetConfigMaps(resourceName?: string): Promise<string> {
    const filter = resourceName ? `-l "app.kubernetes.io/name=requisite-${resourceName}"`: '';
    return runCommand(`minikube kubectl -- get configmap ${filter}`);
}

export function k8sGetSecrets(resourceName?: string): Promise<string> {
    const filter = resourceName ? `-l "app.kubernetes.io/name=requisite-${resourceName}"`: '';
    return runCommand(`minikube kubectl -- get secrets ${filter}`);
}

export function k8sGetIngress(resourceName?: string): Promise<string> {
    const filter = resourceName ? `-l "app.kubernetes.io/name=requisite-${resourceName}"`: '';
    return runCommand(`minikube kubectl -- get ingress ${filter}`);
}

export async function k8sPodsExist(resourceName: string): Promise<boolean> {
    const pods = await k8sGetPods(resourceName);
    return pods.includes(`requisite-${resourceName}`);
}

export async function k8sGetPodIds(resourceName: string): Promise<string[]> {
    const ids = await runCommand(`minikube kubectl -- get pods -l "app.kubernetes.io/name=requisite-${resourceName}" -o=jsonpath='{range .items[*]}{.metadata.name}{"\\n"}{end}'`);
    return ids.split('\n').filter(id => id && id.trim().length > 0);
}

export async function k8sCopyFileToPods(
    resourceName: string,
    srcPath: string,
    destPath: string
): Promise<void> {
    const ids = await k8sGetPodIds(resourceName);
    await Promise.all(ids.map(id => runCommand(`minikube kubectl -- cp ${srcPath} ${id}:${destPath}`)));
}

export async function k8sRunCommandOnPods(
    resourceName: string,
    command: string
): Promise<void> {
    const ids = await k8sGetPodIds(resourceName);
    await Promise.all(ids.map(id => runCommand(`minikube kubectl -- exec -i ${id} -- ${command}`)));
}

export async function k8sCleanTmpResources(): Promise<void> {
    // clean up minikube tmp resources - these can fill up the file
    // system quickly!
    await runCommand('rm /tmp/build.*.tar || true');
    await runCommand('rm /tmp/minikube_*.log || true');
    await runCommand('rm /tmp/juju-* || true');
}

