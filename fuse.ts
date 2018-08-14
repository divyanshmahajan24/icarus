/**
 * This file handle the main part of the electron app
 */

import { ChildProcess, spawn } from 'child_process';
import { FuseBox } from 'fuse-box';

const fuse = FuseBox.init({
  homeDir: 'src/',
  output: 'dist/$name.js',
  sourceMaps: true,
  tsConfig: 'src/main/tsconfig.json',
});

let electronProcess: ChildProcess;

fuse
  .bundle('main/app')
  .target('electron')
  .instructions(' > [main/index.ts]')
  .watch('main/**')
  .completed(() => {
    if (electronProcess && electronProcess.pid) {
      process.kill(-electronProcess.pid);
    }

    electronProcess = spawn(
      'node',
      [`${__dirname}/node_modules/electron/cli.js`, __dirname],
      {
        stdio: 'inherit',
        detached: true,
      },
    ).on('exit', code => {
      if (code !== null) {
        // tslint:disable-next-line:no-console
        console.log(`electron process exited with code ${code}`);

        process.exit(code);
      }
    });
  });

process.on('SIGINT', () => {
  process.kill(-electronProcess.pid);
});

fuse.run();
