import { FuseBox } from 'fuse-box';
import tsTranformJsxSource from 'ts-transform-jsx-source';

const fuse = FuseBox.init({
  homeDir: 'src',
  target: 'browser@es6',
  output: 'dist/$name.js',
  transformers: {
    before: [tsTranformJsxSource]
  }
});

fuse.dev({ port: 9889 });

fuse
  .bundle('app')
  .instructions('> icarus.tsx')
  .hmr()
  .watch('src/**');

fuse.run();
