import { createElectronPackage, PackageConfig } from './package';

const electronVersion = '1.6.0'

const releases: PackageConfig[] = [
    {version: electronVersion, arch: 'x64', platform: 'win32'},
    {version: electronVersion, arch: 'x64', platform: 'linux'}
];

Promise.all(releases.map(config => createElectronPackage(config)))
.then(results => results.forEach(r => console.log('Created Release', r)))
.catch(error => console.log('Error Creating Releases ', error));
