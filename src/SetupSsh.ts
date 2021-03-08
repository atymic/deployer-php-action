const execa = require('execa');
const core = require('@actions/core');
const promise = require('bluebird');
const os = require('os');
const fs = promise.promisifyAll(require('fs'));

interface SshOptions {
  knownHosts: string,
  privateKey: string,
  disableHostKeyChecking: boolean,
}

const fileIncludesString = async (fileName: String, content: String): Promise<boolean> => {
  return new Promise<boolean>((resolve, reject) => {
    fs.readFile(fileName, function (err: any, fileData: any) {
      if (err)
        return resolve(false);
      else if (fileData.includes(content))
        return resolve(true);
      else
        return resolve(false);
    });
  });
}

export default async (options: SshOptions) => {
  const home = process.env['HOME'];
  const sshHome = home + '/.ssh';
  fs.mkdirAsync(sshHome, {recursive: true});

  const authSock = '/tmp/ssh-auth.sock';
  core.exportVariable('SSH_AUTH_SOCK', authSock);

  if (fs.existsSync(authSock)) {
    core.info('Skipping SSH agent setup as agent is already running.');
    return;
  }

  await execa('ssh-agent', ['-a', authSock]);

  // Fix private key line endings
  const privateKey = options.privateKey.replace('/\r/g', '').trim() + '\n';
  await execa('ssh-add', ['-'], {input: privateKey});

  if (options.disableHostKeyChecking) {
    await fs.appendFileAsync(`/etc/ssh/ssh_config`, `StrictHostKeyChecking no`);
    return;
  }

  const knownHostsFileLocation = `${sshHome}/known_hosts`;
  const isHostAlreadyAppended = await fileIncludesString(knownHostsFileLocation, options.knownHosts);

  if (!isHostAlreadyAppended) {
    await fs.appendFileAsync(knownHostsFileLocation, os.EOL + options.knownHosts);
    await fs.chmodAsync(knownHostsFileLocation, '644');
  }
};
