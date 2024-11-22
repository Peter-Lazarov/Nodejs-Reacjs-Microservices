// import * as shell from 'shelljs';
// shell.cp('-R', 'src/emails', 'build/src/');

import fs from 'fs-extra';
fs.copySync('src/emails', 'build/src/emails');
