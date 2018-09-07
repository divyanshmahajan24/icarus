import { spawn } from 'child_process';
import * as path from 'path';
import * as R from 'ramda';
import * as protocol from 'typescript/lib/protocol';

const tsserverPath = path.resolve(
  __dirname,
  '../../../workspace/node_modules/typescript/lib/tsserver.js',
);

const safeParse = (body: string) => {
  try {
    return JSON.parse(body);
  } catch {
    return;
  }
};

type ServerMessage = protocol.Response | protocol.Event | protocol.Request;

function startServer(
  onMessage: (msg: ServerMessage) => void,
  onError?: (error: string) => void,
) {
  const process = spawn('node', [tsserverPath]);

  process.stdout.on('data', data => {
    const messages: ServerMessage[] = R.pipe(
      R.toString,
      R.split(/[\r\n]+/g),
      R.reduce(
        (results, line) => {
          const msg: ServerMessage = safeParse(line);

          if (msg) {
            results.push(msg);
          }

          return results;
        },
        [] as ServerMessage[],
      ),
    )(data);

    messages.forEach(message => onMessage(message));
  });

  process.stderr.on('data', data => {
    if (onError) {
      onError(data.toString());
    }
  });

  function write<T extends protocol.Request>(msg: T) {
    process.stdin.write(JSON.stringify(msg) + '\n');
  }

  return {
    write,
  };
}

export default startServer;

if (!module.parent) {
  // tslint:disable-next-line: no-console
  const { write } = startServer(console.log);

  write({
    seq: 1,
    type: 'request',
    command: 'open',
    arguments: {
      file:
        '/Users/atifafzal/scratch/personal/icarus/workspace/src/components/PlayControl/index.tsx',
    },
  });
}
