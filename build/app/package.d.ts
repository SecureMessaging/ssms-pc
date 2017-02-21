export declare function createElectronPackage(config: PackageConfig): Promise<string>;
export declare class PackageConfig {
    version: string;
    arch: string;
    platform: string;
}
