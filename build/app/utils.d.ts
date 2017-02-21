export declare function downloadElectron(version: string, arch: string, platform: string): Promise<string>;
export declare function unZip(zipFile: string): Promise<string>;
export declare function newTmpDir(): Promise<string>;
export declare function copyDir(from: string, to: string): Promise<string>;
export declare function renameFile(from: string, to: string): Promise<string>;
export declare function writeJsonObject(data: any, file: string): Promise<string>;
export declare function readJsonFile(file: string): Promise<{}>;
export declare function installDependencies(cwd: string): Promise<string>;
export declare function fileExists(file: string): Promise<string>;
export declare function zip(targetFolder: string, targetFile: string): Promise<string>;
export declare function createGithubRelease(release: GitHubReleaseConfig): Promise<string>;
export declare class GitHubReleaseConfig implements GitHubReleaseConfig {
    token: string;
    owner: string;
    repo: string;
    tag: string;
    notes: string;
    draft: boolean;
    prerelease: boolean;
    reuseRelease: boolean;
    reuseDraftOnly: boolean;
    assets: string[];
    apiUrl: string;
    target_commitish: string;
    name: string;
}
export interface GitHubReleaseConfig {
    token: string;
    owner: string;
    repo: string;
    tag: string;
    notes: string;
    draft: boolean;
    prerelease: boolean;
    reuseRelease: boolean;
    reuseDraftOnly: boolean;
    assets: string[];
    apiUrl: string;
    target_commitish: string;
    name: string;
}
