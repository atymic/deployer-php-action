interface DeployerOptions {
    deployerVersion?: string;
    deployerRecipesVersion?: string;
    skipDeployerInstall?: string;
}
declare const _default: (options: DeployerOptions) => Promise<void>;
export default _default;
