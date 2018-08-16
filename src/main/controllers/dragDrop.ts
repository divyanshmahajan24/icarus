import { readFile } from 'fs';
import * as path from 'path';
import { toString } from 'ramda';
import * as ts from 'typescript';
import { promisify } from 'util';
import { IJSXSource } from '../interfaces';
import { findNode, Replacement } from '../utils';
import resolvePath from '../utils/resolvePath';

const readFileAsync = promisify(readFile);

const removeExt = (str: string) => {
  return str.slice(0, -path.extname(str).length);
};

function dragDrop({ start, end }: { start: IJSXSource; end: IJSXSource }) {
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

      const tagNameText = sourceNode.openingElement.tagName.getText();

      const importStatement = findNode(sourceFile, undefined, node => {
        return (
          ts.isImportDeclaration(node) &&
          !!findNode(
            node,
            undefined,
            n => ts.isIdentifier(n) && n.getText() === tagNameText,
          )
        );
      })! as ts.ImportDeclaration; /*? $.moduleSpecifier.text */

      const newPath = removeExt(
        resolvePath({
          start,
          end,
          str: (importStatement.moduleSpecifier as ts.StringLiteral).text,
        }),
      ); // ?

      const importStatementString = Replacement.applyReplacements(
        importStatement.getText(),
        [
          Replacement.delete(
            importStatement.moduleSpecifier.getStart() -
              importStatement.getStart() /* ? */,
            importStatement.moduleSpecifier.getEnd() -
              importStatement.getStart() /* ? */,
          ),
          Replacement.insert(
            importStatement.moduleSpecifier.getStart() -
              importStatement.getStart(),
            `'${newPath}'`,
          ),
        ],
      ); // ?

      return readFileAsync(end.fileName)
        .then(toString)
        .then(targetText => {
          const targetFile = ts.createSourceFile(
            end.fileName,
            targetText,
            ts.ScriptTarget.Latest,
            /*setParentNodes */ true,
          );

          const targetNode = findNode(targetFile, end)! as ts.JsxElement;

          const newTarget = Replacement.applyReplacements(targetText, [
            Replacement.insert(
              targetNode.closingElement.getStart(),
              sourceNode.getText(),
            ),
            Replacement.insert(
              targetFile.getStart(),
              importStatementString + '\n',
            ),
          ]);

          return newTarget; // ?
        });
    });
}

// dragDrop({
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

export default dragDrop;
