import { spawn, ChildProcess } from 'child_process';
import { FuseBox, WebIndexPlugin } from 'fuse-box';

const fuse = FuseBox.init({
  homeDir: 'src/',
  output: 'dist/$name.js',
  plugins: [WebIndexPlugin({ bundles: ['renderer/app'] })],
  sourceMaps: true,
});

let electronProcess: ChildProcess;

fuse
  .bundle('main/app')
  .target('electron')
  .instructions(' > [main/index.ts]')
  .watch('main/**')
  .completed(fuseProcess => {
    console.log(fuseProcess.bundle.name);
    if (electronProcess) {
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

fuse.dev({ port: 7979 });

fuse
  .bundle('renderer/app')
  .target('browser@es6')
  .instructions('> renderer/index.ts')
  .hmr()
  .watch('renderer/**');

fuse.run();
