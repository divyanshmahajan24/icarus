import * as path from 'path';
import * as resolve from 'resolve';
import { IJSXSource } from '../interfaces';

interface IProps {
  start: IJSXSource;
  end: IJSXSource;
  str: string;
}

function resolvePath({ start, end, str }: IProps) {
  const sourceFileDirPath = path.dirname(start.fileName);
  const resolvedSourceComponentPath = resolve.sync(str, {
    basedir: sourceFileDirPath,
    extensions: ['.ts', '.tsx'],
  }); // ?

  const targetFileDirPath = path.dirname(end.fileName);
  const pathFromTargetToSource = path.relative(
    targetFileDirPath,
    resolvedSourceComponentPath,
  ); // ?

  return pathFromTargetToSource;
}

// resolvePath({
//   start: {
//     fileName:
//       '/Users/atifafzal/scratch/personal/meta-x/ui/src/workspace/components/Button/meta.tsx',
//     lineNumber: 7,
//     columnNumber: 5,
//   },
//   end: {
//     fileName:
//       '/Users/atifafzal/scratch/personal/meta-x/ui/src/workspace/components/Form/index.tsx',
//     lineNumber: 21,
//     columnNumber: 5,
//   },
//   str: './',
// });

export default resolvePath;
