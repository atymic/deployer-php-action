const execa = require('execa');
const core = require('@actions/core');
const promise = require('bluebird');
const fs = promise.promisifyAll(require('fs'));

interface SshOptions {
    knownHosts: string,
    privateKey: string,
    disableHostKeyChecking: boolean,
}

export default async (options: SshOptions) => {
    const home = process.env['HOME'];
    const sshHome = home + '/.ssh';
    fs.mkdirAsync(sshHome, { recursive: true});

    const authSock = '/tmp/ssh-auth.sock';
    await execa('ssh-agent', ['-a', authSock]);
    core.exportVariable('SSH_AUTH_SOCK', authSock);

    // Fix private key line endings
    const privateKey = options.privateKey.replace('/\r/g', '');
    await execa('ssh-add -', {input: privateKey});

    if (options.disableHostKeyChecking) {
        await fs.appendFileAsync(`/etc/ssh/ssh_config`, `StrictHostKeyChecking no`);
        return;
    }

    await fs.appendFileAsync(`${sshHome}/known_hosts`, options.knownHosts);
};
