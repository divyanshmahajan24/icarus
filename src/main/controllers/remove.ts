import { readFile } from 'fs';
import { toString } from 'ramda';
import * as ts from 'typescript';
import { promisify } from 'util';
import { IJSXSource } from '../interfaces';
import { findNode, Replacement } from '../utils';

const readFileAsync = promisify(readFile);

function remove({ start }: { start: IJSXSource }) {
  return readFileAsync(start.fileName)
    .then(toString)
    .then(sourceText => {
      const sourceFile = ts.createSourceFile(
        start.fileName,
        sourceText,
        ts.ScriptTarget.Latest,
        /*setParentNodes */ true,
      );

      const sourceNode = findNode(sourceFile, start)! as ts.JsxElement;

      const updatedSource = Replacement.applyReplacements(
        sourceFile.getText(),
        [Replacement.delete(sourceNode.getStart(), sourceNode.getEnd())],
      ); // ?

      return updatedSource;
    });
}

// remove({
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
// });

export default remove;
