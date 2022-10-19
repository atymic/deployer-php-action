# `deployer-php` GitHub Action

[Deployer](https://deployer.org/) is an open source zero downtime deployment tool for PHP.

This action makes it easy to deploy your php services using [Github Actions](https://help.github.com/en/actions) by setting up everything for you.

### What the action does
* Starts the `ssh-agent`
* Loads your deployment SSH private key into the agent
* Configures `known_hosts` with your provided key (or turns of SSH host key checking)
* Installs deployer & deployer recipes

## Using the action

For a complete guide on setting Zero Downtime Deployment with Laravel, see: [atymic.dev/blog/github-actions-laravel-ci-cd/](https://atymic.dev/blog/github-actions-laravel-ci-cd).

1. Create an SSH private key for your deploy user. It's a good idea to generate a new key specifically for deployment (ideally on a specific deployment user with minimal permissions).
2. In your repository, go to the *Settings > Secrets* menu and create a new secret called `SSH_PRIVATE_KEY`. Put the *unencrypted private* SSH key into the contents field. <br>
  This key should start with `-----BEGIN RSA PRIVATE KEY-----`, consist of many lines and ends with `-----END RSA PRIVATE KEY-----`. 
  You can just copy the key as-is from the private key file.  
  _Note: This actions supports both standard keys & pem keys (the action will fix the formatting before loading them into the agent)._
3. Add another Secret called `SSH_KNOWN_HOSTS`, and paste the key fingerprint(s) of your server. You can find these using the following command `ssh-keyscan -t rsa <server IP or hostname>`. Make sure you're using the same hostname or IP as you defined in the "host" section of your deploy.php.
4.  
   **Disabling Host Check Checking (Not Recommended):**  
   You can disable strict host key checking by passing `ssh-disable-host-key-checking: true` to the action.
  
4. In your workflow definition file, add the following step. This should be after setting up php & installing composer dependencies.

```yaml
# .github/workflows/workflow.yml
jobs:
    deployment_job:
        ...
        steps:
            - actions/checkout@v1
            - uses: shivammathur/setup-php@master
                with:
                  php-version: 7.3
            - run: composer install
            # Make sure the @0.3.1 matches the current version of the action
            # You can also use `master`, but it's best to lock to a specific version
            - uses: atymic/deployer-php-action@0.3.1
              with:
                  ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}
                  ssh-known-hosts: ${{ secrets.SSH_KNOWN_HOSTS }}
                  # To disable host key checking (insecure!):
                  ssh-disable-host-key-checking: true
            - ... other steps
```
## Known issues and limitations

### Works for the current job only

Since each job [runs in a fresh instance](https://help.github.com/en/articles/about-github-actions#job) of the virtual environment, the SSH key will only be available in the job where this action has been referenced. You can, of course, add the action in multiple jobs or even workflows. All instances can use the same `SSH_PRIVATE_KEY` secret.

## Creating SSH keys

In order to create a new SSH key, run `ssh-keygen -t rsa -b 4096 -m pem -f path/to/keyfile`. This will prompt you for a key passphrase and save the key in `path/to/keyfile`.

Having a passphrase is a good thing, since it will keep the key encrypted on your disk. When configuring the secret `SSH_PRIVATE_KEY` value in your repository, however, you will need the private key *unencrypted*. 

## Contributing

Javascript Actions Documentation: https://help.github.com/en/articles/creating-a-javascript-action

* Fork/Clone the repo.
* Run `yarn install` to fetch dependencies
* Make changes
* Update the README with any changes (if required)
* Create a PR *without* building the code (it's too hard to review the compiled code. I'll compile it before releasing)

# Credits

Copyright 2019 atymic. Code released under [the MIT license](LICENSE).
