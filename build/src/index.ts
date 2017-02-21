import { createElectronPackage } from './package';

/*createElectronPackage('1.6.0', 'x64' , 'linux')
    .then(r => console.log(r))
    .catch(e => console.log(e));*/

createElectronPackage('1.6.0', 'x64' , 'win32')
    .then(r => console.log(r))
    .catch(e => console.log(e));