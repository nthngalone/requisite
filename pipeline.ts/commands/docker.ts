import { runCommand } from './command';

export async function dockerPrune(): Promise<void> {
    // original commands
    // await runCommand('sudo docker image prune -a -f');
    // await runCommand('sudo docker network prune -f');
    // await runCommand('sudo docker builder prune -a -f');
    // await runCommand('sudo docker volume prune -f');
    // await runCommand('sudo docker container prune -f');
    // await runCommand('sudo docker system prune -a -f');

    // since the builds are run inside of minikube, we must also prune inside minikube
    await runCommand('minikube ssh -- docker system prune -a -f');
}

export function dockerBuild(resourceName: string, tag: string): Promise<string> {
    // original command:
    // eslint-disable-next-line max-len
    // return runCommand(`sudo docker build -f ./Dockerfile-${resourceName} -t requisite/${resourceName}:${tag} .`);

    // updated to run the docker build inside of minikube
    // NOTE: if updated to build in local docker again,
    //       the k8s publish command must also be ran
    return runCommand(`minikube image build -f ./Dockerfile-${resourceName} -t requisite/${resourceName}:${tag} .`);
}
