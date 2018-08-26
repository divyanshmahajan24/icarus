import { readFile } from 'fs';
import * as R from 'ramda';
import * as ts from 'typescript';
import { promisify } from 'util';
import { IJSXSource } from '../interfaces';
import { findNode } from '../utils';
import getTemplateText from '../utils/getTemplateText';

const readFileAsync = promisify(readFile);

function getStyles(
  start: IJSXSource,
): Promise<Record<string, string> | undefined> {
  return readFileAsync(start.fileName)
    .then(R.toString)
    .then(sourceText => {
      const sourceFile = ts.createSourceFile(
        start.fileName,
        sourceText,
        ts.ScriptTarget.Latest,
        /* setParentNodes */ true,
      );

      const sourceNode = findNode(sourceFile, start); /*? $.getText() */

      if (sourceNode) {
        const text = getTemplateText(sourceFile, sourceNode.getText());

        if (text) {
          const result = text
            .split(';')
            .map(R.trim)
            .filter(x => x)
            .map(x => {
              const y = x.split(':');

              return { [y[0].trim()]: y[1].trim() };
            })
            .reduce((ob, x) => {
              return { ...ob, ...x };
            }, {});

          return result;
        }
      }

      return;
    });
}

if (!module.parent) {
  getStyles({
    fileName:
      '/Users/atifafzal/scratch/personal/icarus/workspace/src/components/Seeker/index.tsx',
    lineNumber: 30,
    columnNumber: 4,
  });
}

export default getStyles;
