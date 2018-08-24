import { readFile } from 'fs';
import * as path from 'path';
import { toString, replace } from 'ramda';
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

      const sourceNode = findNode<ts.JsxElement | ts.JsxSelfClosingElement>(
        sourceFile,
        start,
      );

      if (!sourceNode) {
        return sourceText;
      }

      let tagNameText: string;

      if (ts.isJsxElement(sourceNode)) {
        tagNameText = sourceNode.openingElement.tagName.getText();
      }

      if (ts.isJsxSelfClosingElement(sourceNode)) {
        tagNameText = sourceNode.tagName.getText();
      }

      const importStatement = findNode<ts.ImportDeclaration>(
        sourceFile,
        undefined,
        node => {
          return (
            ts.isImportDeclaration(node) &&
            !!findNode(
              node,
              undefined,
              n => ts.isIdentifier(n) && n.getText() === tagNameText,
            )
          );
        },
      );

      let importStatementString: string;

      if (importStatement) {
        const newPath = removeExt(
          resolvePath({
            start,
            end,
            str: (importStatement.moduleSpecifier as ts.StringLiteral).text,
          }),
        ); // ?

        importStatementString = Replacement.applyReplacements(
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
      }

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

          const replacements = [
            Replacement.insert(
              targetNode.closingElement.getStart(),
              sourceNode.getText(),
            ),
          ];

          if (importStatementString) {
            replacements.push(
              Replacement.insert(
                targetFile.getStart(),
                importStatementString + '\n',
              ),
            );
          }

          const newTarget = Replacement.applyReplacements(
            targetText,
            replacements,
          );

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
