const execa = require('execa');
const core = require('@actions/core');

interface DeployerOptions {
    deployerVersion?: string,
    deployerRecipesVersion?: string,
    skipDeployerInstall?: string,
}

export default async (options: DeployerOptions): Promise<void> => {
    if (options.skipDeployerInstall) return;

    const deployerPackage = options.deployerVersion
        ? `deployer/deployer:${options.deployerVersion}`
        : 'deployer/deployer';
    const deployerRecipesPackage = options.deployerRecipesVersion
        ? `deployer/recipes:${options.deployerRecipesVersion}`
        : 'deployer/recipes';

    await execa('composer', ['global', 'require', deployerPackage, deployerRecipesPackage]);

    const installPath = (await execa('composer', ['global', 'config', 'home'])).stdout;
    core.addPath(`${installPath}/vendor/bin`);
};
