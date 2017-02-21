"use strict";
const euara_bs_1 = require("euara-bs");
const Electron = require("electron");
const app = Electron.remote.app;
const appDir = app.getPath('userData');
let bs = new euara_bs_1.EUARABS('apps-ssms-test', appDir);
console.log(__dirname);
bs.getAppEntryPoint()
    .then(entry => {
    let file = 'file://' + entry + "/index.html";
    console.log('entry', file);
    let iframe = document.getElementById('app-container');
    iframe.src = file;
})
    .catch(err => { throw err; });
//# sourceMappingURL=index.js.map