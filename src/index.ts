import { EUARABS } from 'euara-bs';
import * as Electron from 'electron';

const app = Electron.remote.app;
const appDir = app.getPath('userData');
import * as fs from 'fs';

let bs = new EUARABS('apps-ssms-test', appDir);
console.log(__dirname);
bs.getAppEntryPoint()
.then(entry => {
    let file = 'file://' + entry + "/index.html";
    console.log('entry', file);
    let iframe: HTMLIFrameElement = (document.getElementById('app-container') as HTMLIFrameElement);
     iframe.src = file;

})
.catch(err => { throw err });

