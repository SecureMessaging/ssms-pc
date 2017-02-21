import * as utils from './utils';

export async function createElectronPackage(config: PackageConfig) {

    const homeDir = utils.getHomeDir();
    console.log("Download Electron");
    const electronReleaseZip = await utils.downloadElectron(config.version, config.arch, config.platform);
    console.log("Unzipping");
    const releaseDir = await utils.unZip(electronReleaseZip);
    console.log("Coping App to ", releaseDir);
    await utils.copyDir(__dirname + '/../../app', releaseDir + '/resources/app');
    console.log("Install Dependencies");
    await utils.installDependencies(releaseDir + '/resources/app');
    const packageJson = require(releaseDir + '/resources/app/package.json');

    let targetRename, destRename;
    const releaseName = packageJson.electronName;
    const releaseVersion = packageJson.version;
    if(config.platform === 'win32') {
        targetRename = releaseDir + '/electron.exe';
        destRename = releaseDir + '/' + packageJson.electronName + '.exe';
    } else {
        targetRename = releaseDir + '/electron';
        destRename = releaseDir + '/' + packageJson.electronName;        
    } 
    await utils.renameFile(targetRename, destRename);

    const releasePackageName = `${releaseName}-v${releaseVersion}-${config.platform}-${config.arch}.zip`;
    const releaseZipFile = __dirname + '/../../out/' + releasePackageName;
    console.log("Creating Release Zip", releaseZipFile);
    await utils.zip(releaseDir, releaseZipFile);

    console.log('Creating Github Release');

    const credentials = await utils.readJsonFile(homeDir + '/.githubcreds');
    const releaseSettings = new utils.GitHubReleaseConfig;
    releaseSettings.token = credentials['ssms-pc'];
    releaseSettings.assets = [releaseZipFile];
    releaseSettings.owner = 'SecureMessaging';
    releaseSettings.repo = 'ssms-pc';
    releaseSettings.draft = true;
    releaseSettings.prerelease = true;
    releaseSettings.tag = releaseVersion;
    releaseSettings.name = releasePackageName;
    releaseSettings.notes = packageJson.notes || '';
    await utils.createGithubRelease(releaseSettings)
    return releasePackageName;
}

export class PackageConfig {
    version: string;
    arch: string;
    platform: string;
}