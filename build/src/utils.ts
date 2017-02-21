const electronDownload = require('electron-download');
const unzip = require('unzip');
const streamToPromise = require('stream-to-promise');
const tmp = require('tmp');
const copydir = require('copy-dir');
const jsonfile = require('jsonfile')
const mv = require('mv');
const fileexists = require('file-exists');
const zipFolder = require('zip-folder');
const publishRelease = require('publish-release');
import { spawn as yarnOrNPMSpawn , hasYarn } from 'yarn-or-npm';
import * as fs from 'fs';

export function downloadElectron(version: string, arch: string, platform: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        electronDownload({
        version: version,
        arch: arch,
        platform: platform,
        cache: '~/.cache/SSMS-PC_builds' // defaults to <user's home directory>/.electron
        }, function (err, zipPath) {
            if(err) {
                reject(err);
            } else {
                resolve(zipPath);
            }
        })
    });
}

export async function unZip(zipFile: string): Promise<string> {
    const tmpDir = await newTmpDir();
    await streamToPromise(fs.createReadStream(zipFile).pipe(unzip.Extract({ path: tmpDir })));
    return tmpDir;
}


export function newTmpDir(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        tmp.dir(function _tempDirCreated(err, path, cleanupCallback) {
            if (err) {
                reject(err);
            } else {
                resolve(path);
            }
        });
    });
}

export function copyDir(from: string, to: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        copydir(from, to, function(err){
            if(err){
                reject(err);
            } else {
                resolve('ok');
            }
        });
    });
}

export function renameFile(from: string, to: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        mv(from, to, function(err) {
            if(err){
                reject(err);
            } else {
                resolve('ok');
            }
        });
    });
}

export function writeJsonObject(data: any, file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        jsonfile.writeFile(file, data, {spaces: 2}, function(err) {
            if(err){
                reject(err);
            } else {
                resolve('ok');
            }
        });
    });
}

export function readJsonFile(file: string): Promise<{}> {
    return new Promise<string>((resolve, reject) => {
        jsonfile.readFile(file, function(err, obj) {
            if(err){
                reject(err);
            } else {
                resolve(obj);
            }
        });
    });
}

export function installDependencies(cwd: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        let cmd = ['install', '--production'];
        const child = yarnOrNPMSpawn(cmd, {
            cwd: cwd,
            stdio: 'inherit',
        });
        child.on('exit', (code) => {
            if (code !== 0) {
                return reject('Failed to install modules');
            } else {
                resolve('Ok');
            }
        });
    });

}

export function fileExists(file: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        fileexists(file, (err, exists) => {
            if (err) {
                return reject(err);
            } else {
                resolve(exists);
            }
        });
    });
}

export function zip(targetFolder: string, targetFile: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        zipFolder(targetFolder,targetFile , (err, exists) => {
            if (err) {
                return reject(err);
            } else {
                resolve(exists);
            }
        });
    });
}

export function createGithubRelease(release: GitHubReleaseConfig): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        publishRelease(release , (err, release) => {
            if (err) {
                return reject(err);
            } else {
                resolve(release);
            }
        });
    });
}

export class GitHubReleaseConfig implements GitHubReleaseConfig {
    token: string;
    owner: string;
    repo: string;
    tag: string;
    notes: string = '';
    draft: boolean = false;
    prerelease: boolean = false;
    reuseRelease: boolean = false;
    reuseDraftOnly: boolean = false;
    assets: string[];
    apiUrl: string = 'https://api.github.com';
    target_commitish: string = 'master';
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

