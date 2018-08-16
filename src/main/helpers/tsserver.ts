import { spawn } from 'child_process';
import * as path from 'path';

const tsserverPath = path.resolve(
  __dirname,
  '../../ui/node_modules/typescript/lib/tsserver.js',
);

function startServer() {
  const process = spawn('node', [tsserverPath]);

  process.stdout.on('data', data => {
    // tslint:disable-next-line:no-console
    console.log(data.toString());
    process.stdin.write(
      '{"seq":1,"type":"quickinfo","command":"open","arguments":{"file":"/Users/atifafzal/scratch/personal/meta-x/ui/src/workspace/components/Form/index.tsx"}}\n',
    );
  });

  process.stderr.on('data', data => {
    // tslint:disable-next-line:no-console
    console.error(data.toString());
  });
}

export default startServer;
