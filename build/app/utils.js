"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const electronDownload = require('electron-download');
const unzip = require('unzip');
const streamToPromise = require('stream-to-promise');
const tmp = require('tmp');
const copydir = require('copy-dir');
const jsonfile = require('jsonfile');
const mv = require('mv');
const fileexists = require('file-exists');
const zipFolder = require('zip-folder');
const publishRelease = require('publish-release');
const homedir = require('homedir');
const yarn_or_npm_1 = require("yarn-or-npm");
const fs = require("fs");
function downloadElectron(version, arch, platform) {
    return new Promise((resolve, reject) => {
        electronDownload({
            version: version,
            arch: arch,
            platform: platform,
            cache: getHomeDir() + '/.cache/SSMS-PC_builds' // defaults to <user's home directory>/.electron
        }, function (err, zipPath) {
            if (err) {
                reject(err);
            }
            else {
                resolve(zipPath);
            }
        });
    });
}
exports.downloadElectron = downloadElectron;
function unZip(zipFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const tmpDir = yield newTmpDir();
        yield streamToPromise(fs.createReadStream(zipFile).pipe(unzip.Extract({ path: tmpDir })));
        return tmpDir;
    });
}
exports.unZip = unZip;
function newTmpDir() {
    return new Promise((resolve, reject) => {
        tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
            if (err) {
                reject(err);
            }
            else {
                resolve(path);
            }
        });
    });
}
exports.newTmpDir = newTmpDir;
function copyDir(from, to) {
    return new Promise((resolve, reject) => {
        copydir(from, to, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('ok');
            }
        });
    });
}
exports.copyDir = copyDir;
function renameFile(from, to) {
    return new Promise((resolve, reject) => {
        mv(from, to, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('ok');
            }
        });
    });
}
exports.renameFile = renameFile;
function writeJsonObject(data, file) {
    return new Promise((resolve, reject) => {
        jsonfile.writeFile(file, data, { spaces: 2 }, function (err) {
            if (err) {
                reject(err);
            }
            else {
                resolve('ok');
            }
        });
    });
}
exports.writeJsonObject = writeJsonObject;
function readJsonFile(file) {
    return new Promise((resolve, reject) => {
        jsonfile.readFile(file, function (err, obj) {
            if (err) {
                reject(err);
            }
            else {
                resolve(obj);
            }
        });
    });
}
exports.readJsonFile = readJsonFile;
function installDependencies(cwd) {
    return new Promise((resolve, reject) => {
        let cmd = ['install', '--production'];
        const child = yarn_or_npm_1.spawn(cmd, {
            cwd: cwd,
            stdio: 'inherit',
        });
        child.on('exit', (code) => {
            if (code !== 0) {
                return reject('Failed to install modules');
            }
            else {
                resolve('Ok');
            }
        });
    });
}
exports.installDependencies = installDependencies;
function fileExists(file) {
    return new Promise((resolve, reject) => {
        fileexists(file, (err, exists) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(exists);
            }
        });
    });
}
exports.fileExists = fileExists;
function zip(targetFolder, targetFile) {
    return new Promise((resolve, reject) => {
        zipFolder(targetFolder, targetFile, (err, exists) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(exists);
            }
        });
    });
}
exports.zip = zip;
function createGithubRelease(release) {
    return new Promise((resolve, reject) => {
        publishRelease(release, (err, release) => {
            if (err) {
                return reject(err);
            }
            else {
                resolve(release);
            }
        });
    });
}
exports.createGithubRelease = createGithubRelease;
function getHomeDir() {
    return homedir();
}
exports.getHomeDir = getHomeDir;
class GitHubReleaseConfig {
    constructor() {
        this.notes = '';
        this.draft = false;
        this.prerelease = false;
        this.reuseRelease = false;
        this.reuseDraftOnly = false;
        this.apiUrl = 'https://api.github.com';
        this.target_commitish = 'master';
    }
}
exports.GitHubReleaseConfig = GitHubReleaseConfig;
//# sourceMappingURL=utils.js.map