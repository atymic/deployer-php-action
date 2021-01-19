const execa = require('execa');
const core = require('@actions/core');

interface DeployerOptions {
    deployerVersion?: string,
    skipDeployerInstall?: string,
}

export default async (options: DeployerOptions): Promise<void> => {
    if (options.skipDeployerInstall) return;

    const deployerPackage = options.deployerVersion
        ? `deployer/deployer:${options.deployerVersion}`
        : 'deployer/deployer';

    await execa('composer', ['global', 'require', deployerPackage]);

    const installPath = (await execa('composer', ['global', 'config', 'home'])).stdout;
    core.addPath(`${installPath}/vendor/bin`);
};
