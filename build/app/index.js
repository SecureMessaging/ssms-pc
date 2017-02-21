"use strict";
const package_1 = require("./package");
/*createElectronPackage('1.6.0', 'x64' , 'linux')
    .then(r => console.log(r))
    .catch(e => console.log(e));*/
package_1.createElectronPackage('1.6.0', 'x64', 'win32')
    .then(r => console.log(r))
    .catch(e => console.log(e));
//# sourceMappingURL=index.js.map