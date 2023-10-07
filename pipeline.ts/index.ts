import { series, parallel, type TaskFunctionCallback as Callback } from 'gulp';
import { npmRun } from './commands/npm';
import { dockerPrune, dockerBuild } from './commands/docker';
import { k8sPodsExist, k8sGetPods, k8sGetServices, k8sGetConfigMaps, k8sGetSecrets, k8sGetIngress, k8sCopyFileToPods, k8sRunCommandOnPods, k8sCleanTmpResources } from './commands/kubernetes';
import { helmResourceExists, helmUninstall, helmInstall } from './commands/helm';
import { waitUntil, pingApp, renderTemplate, writeFile, removeFile, getLogger } from './utils';
import { version } from '../package.json';
import { config } from 'dotenv';

config();

const buildContext: Record<string, boolean> = {
    srcBuildEnabled: true,
    srcLintEnabled: true,
    srcTestEnabled: true,
    cleanContainerResourcesEnabled: true,
    imgBuildAndPublishApiEnabled: true,
    imgBuildAndPublishUiEnabled: true,
    deployHelmResourceConfigMapEnabled: true,
    deployHelmResourceSecretEnabled: true,
    deployHelmResourceApiEnabled: true,
    deployHelmResourceUiEnabled: true,
    reportDeployedResourcesEnabled: true,
    e2eApiTestsEnabled: true,
    e2eWebTestsEnabled: true
};

// Helpers!

async function runStep(
    stepName: string,
    process: (cb: Callback) => Promise<void>,
    cb: Callback
): Promise<void> {
    if (buildContext[`${stepName}Enabled`]) {
        try {
            await process(cb);
            cb();
        } catch(error) {
            cb(error);
        }
    } else {
        getLogger().warn(`Step [${stepName}] disabled in the build context`);
        cb();
    }
}

async function renderHelmValuesTemplate(resourceName: string): Promise<void> {
    const content = await renderTemplate(`./requisite-helm/values/requisite-${resourceName}/values.ejs`, process.env);
    await writeFile(`./requisite-helm/values/requisite-${resourceName}/values.yaml`, content);
}

function removeRenderedHelmValuesFile(resourceName: string): Promise<void> {
    return removeFile(`./requisite-helm/values/requisite-${resourceName}/values.yaml`);
}

async function removeHelmResource(resourceName: string): Promise<void> {
    const exists = await helmResourceExists(resourceName);
    if (exists) {
        await helmUninstall(resourceName);
        await waitUntil(`!k8sPodsExist for ${resourceName}`, async () => {
            return !(await k8sPodsExist(resourceName));
        });
    }
}

// Pipeline Steps!

function init(cb: Callback) {
    if (process.argv.includes('--basic')) {
        // In basic mode, turn off everything except building, linting,
        // and unit testing
        buildContext.cleanContainerResourcesEnabled = false;
        buildContext.imgBuildAndPublishApiEnabled = false;
        buildContext.imgBuildAndPublishUiEnabled = false;
        buildContext.deployHelmResourceConfigMapEnabled = false;
        buildContext.deployHelmResourceSecretEnabled = false;
        buildContext.deployHelmResourceApiEnabled = false;
        buildContext.deployHelmResourceUiEnabled = false;
        buildContext.reportDeployedResourcesEnabled = false;
        buildContext.e2eApiTestsEnabled = false;
        buildContext.e2eWebTestsEnabled = false;
        getLogger().info('Starting pipeline in BASIC mode with context: ', buildContext);
    } else {
        getLogger().info('Starting pipeline with context: ', buildContext);
    }
    cb();
}

function build(cb: Callback) {
    runStep('srcBuild', async () => {
        await npmRun('build');
    }, cb);
}

function lint(cb: Callback) {
    runStep('srcLint', async () => {
        await npmRun('lint');
    }, cb);
}

function test(cb: Callback) {
    runStep('srcTest', async () => {
        await npmRun('test');
    }, cb);
}

function cleanContainerResources(cb: Callback) {
    runStep('cleanContainerResources', async () => {
        await dockerPrune();
        await k8sCleanTmpResources();
    }, cb);
}

function buildAndPublishImgApi(cb: Callback) {
    runStep('imgBuildAndPublishApi', async () => {
        await dockerBuild('api', version);
    }, cb);
}

function buildAndPublishImgUi(cb: Callback) {
    runStep('imgBuildAndPublishUi', async () => {
        await dockerBuild('ui', version);
    }, cb);
}

function deployHelmResourceConfigMap(cb: Callback) {
    runStep('deployHelmResourceConfigMap', async () => {
        await renderHelmValuesTemplate('config');
        await removeHelmResource('config');
        await helmInstall('config', version);
        await removeRenderedHelmValuesFile('config');
    }, cb);
}

function deployHelmResourceSecret(cb: Callback) {
    runStep('deployHelmResourceSecret', async () => {
        await renderHelmValuesTemplate('secret');
        await removeHelmResource('secret');
        await helmInstall('secret', version);
        await removeRenderedHelmValuesFile('secret');
    }, cb);
}

function deployHelmResourceApi(cb: Callback) {
    runStep('deployHelmResourceApi', async () => {
        // Deploy database and admin tool
        await removeHelmResource('db');
        await helmInstall('db');
        await removeHelmResource('db-admin');
        await helmInstall('db-admin');
        await pingApp('db-admin', 'http://requisite-dbadmin.local/login');

        // Import database connections into admin tool
        await k8sCopyFileToPods('db-admin', './requisite-db/pgadmin-servers.json', '/tmp');
        await k8sRunCommandOnPods('db-admin', '\'sh\' < ./requisite-db/import-servers.sh');

        // Deploy api
        await removeHelmResource('api');
        await helmInstall('api', version);
        await pingApp('api', 'http://requisite.local/api/system/health');
    }, cb);
}

function deployHelmResourceUi(cb: Callback) {
    runStep('deployHelmResourceUi', async () => {
        await removeHelmResource('ui');
        await helmInstall('ui', version);
        await pingApp('ui', 'http://requisite.local/system/health');
    }, cb);
}

function reportDeployedResources(cb: Callback) {
    runStep('reportDeployedResources', async () => {
        const pods = await k8sGetPods();
        getLogger().info(`***PODS***\n${pods}`);
        const services = await k8sGetServices();
        getLogger().info(`***SERVICES***\n${services}`);
        const configMaps = await k8sGetConfigMaps();
        getLogger().info(`***CONFIGMAPS***\n${configMaps}`);
        const secrets = await k8sGetSecrets();
        getLogger().info(`***SECRETS***\n${secrets}`);
        const ingress = await k8sGetIngress();
        getLogger().info(`***INGRESS***\n${ingress}`);
    }, cb);
}

function e2eApiTests(cb: Callback) {
    runStep('e2eApiTests', async () => {
        await npmRun('test:e2e:api');
    }, cb);
}

function e2eWebTests(cb: Callback) {
    runStep('e2eWebTests', async () => {
        await npmRun('test:e2e:web');
    }, cb);
}

export default series(
    init,
    build,
    lint,
    test,
    cleanContainerResources,
    parallel(
        buildAndPublishImgApi,
        buildAndPublishImgUi
    ),
    deployHelmResourceConfigMap,
    deployHelmResourceSecret,
    parallel(
        deployHelmResourceApi,
        deployHelmResourceUi
    ),
    reportDeployedResources,
    parallel(
        e2eApiTests,
        e2eWebTests
    )
);
