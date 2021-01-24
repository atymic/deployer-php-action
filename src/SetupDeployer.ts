const execa = require('execa');
const core = require('@actions/core');

interface DeployerOptions {
    deployerVersion?: string,
    deployerRecipesVersion?: string,
    skipDeployerInstall?: string,
}

const getInstalledDeployerMajorVersion = async (): Promise<number|null> => {
    const {stdout} = await execa('composer', ['global', 'show', 'deployer/deployer']);

    const regexp = /^versions.*?(\d+)/im;
    const matches = regexp.exec(stdout);

    return matches && +matches[1];
}

export default async (options: DeployerOptions): Promise<void> => {
    if (options.skipDeployerInstall) return;

    const deployerPackage = options.deployerVersion
        ? `deployer/deployer:${options.deployerVersion}`
        : 'deployer/deployer';

    await execa('composer', ['global', 'require', deployerPackage]);

    const deployerMajor = await getInstalledDeployerMajorVersion();

    if (deployerMajor && deployerMajor <= 6) {
        const deployerRecipesPackage = options.deployerRecipesVersion
            ? `deployer/recipes:${options.deployerRecipesVersion}`
            : 'deployer/recipes';

        await execa('composer', ['global', 'require', deployerRecipesPackage]);
    }

    const installPath = (await execa('composer', ['global', 'config', 'home'])).stdout;
    core.addPath(`${installPath}/vendor/bin`);
};
