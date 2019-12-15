interface SshOptions {
    knownHosts: string;
    privateKey: string;
    disableHostKeyChecking: boolean;
}
declare const _default: (options: SshOptions) => Promise<void>;
export default _default;
