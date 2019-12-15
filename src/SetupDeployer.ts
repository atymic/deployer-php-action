const execa = require('execa');
const core = require('@actions/core');

export default async (version?: string): Promise<void> => {
    const packageName = version ? `deployer/deployer:${version}` : 'deployer/deployer';
    await execa('composer', ['global', 'require', packageName]);

    const installPath = (await execa('composer', ['global', 'config', 'home'])).stdout;
    core.addPath(`${installPath}/vendor/bin`);
};
