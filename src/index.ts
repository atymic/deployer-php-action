import SetupDeployer from "./SetupDeployer";
import SetupSsh from "./SetupSsh";

// Force NCC to include required deps
require('rxjs-compat');
require("any-observable/register")('rxjs')

const core = require('@actions/core');
const Listr = require('listr');

const tasks = new Listr([
    {
        title: 'Install Deployer',
        task: () => SetupDeployer(core.getInput('deployer-version'))
    },
    {
        title: 'Setup SSH',
        task: () => SetupSsh({
            privateKey: core.getInput('ssh-private-key'),
            knownHosts: core.getInput('ssh-known-hosts'),
            disableHostKeyChecking: <boolean>core.getInput('ssh-disable-host-key-checking'),
        })
    },
], {concurrent: true});

tasks.run().catch((err: Error) => {
    core.error(err);
    core.setFailed(err)
});
