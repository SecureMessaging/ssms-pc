"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const utils = require("./utils");
function createElectronPackage(version, arch, platform) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Download Electron");
        const electronReleaseZip = yield utils.downloadElectron(version, arch, platform);
        console.log("Unzipping");
        const releaseDir = yield utils.unZip(electronReleaseZip);
        console.log("Coping App to ", releaseDir);
        yield utils.copyDir(__dirname + '/../../app', releaseDir + '/resources/app');
        console.log("Install Dependencies");
        yield utils.installDependencies(releaseDir + '/resources/app');
        const packageJson = require(releaseDir + '/resources/app/package.json');
        console.log(releaseDir + '/' + packageJson.electronName);
        let targetRename, destRename;
        const releaseName = packageJson.electronName;
        const releaseVersion = packageJson.version;
        if (platform === 'win32') {
            targetRename = releaseDir + '/electron.exe';
            destRename = releaseDir + '/' + packageJson.electronName + '.exe';
        }
        else {
            targetRename = releaseDir + '/electron';
            destRename = releaseDir + '/' + packageJson.electronName;
        }
        yield utils.renameFile(targetRename, destRename);
        const releaseZipFile = __dirname + '/../../out/' + `${releaseName}-v${releaseVersion}-${platform}-${arch}.zip`;
        console.log("Creating Release Zip", releaseZipFile);
        yield utils.zip(releaseDir, releaseZipFile);
        console.log('Creating Github Release');
        const credentials = yield utils.readJsonFile('~/.githubcreds');
        const releaseSettings = new utils.GitHubReleaseConfig;
        releaseSettings.token = credentials['ssms-pc'];
        releaseSettings.assets = [releaseZipFile];
        releaseSettings.owner = 'SecureMessaging';
        releaseSettings.repo = 'ssms-pc';
        releaseSettings.draft = true;
        releaseSettings.prerelease = true;
        releaseSettings.tag = releaseVersion;
        releaseSettings.name = `${releaseName}-v${releaseVersion}-${platform}-${arch}.zip`;
        releaseSettings.notes = packageJson.notes || '';
        return yield utils.createGithubRelease(releaseSettings);
    });
}
exports.createElectronPackage = createElectronPackage;
//# sourceMappingURL=package.js.map