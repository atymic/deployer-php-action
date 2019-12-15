const execa = require('execa');
const promise = require('bluebird');

export default async (version?: string): Promise<void> => {
    const packageName = version ? `deployer/deployer:${version}` : 'deployer/deployer';
    await execa('composers', ['global', 'require', packageName])
};
