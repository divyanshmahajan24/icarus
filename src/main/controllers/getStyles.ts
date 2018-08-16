import { readFile } from 'fs';
import * as R from 'ramda';
import * as ts from 'typescript';
import { promisify } from 'util';
import { IJSXSource } from '../interfaces';
import { findNode } from '../utils';
import getTemplateText from '../utils/getTemplateText';

const readFileAsync = promisify(readFile);

function getStyles({
  start,
}: {
  start: IJSXSource;
}): Promise<Array<Record<string, string>> | undefined> {
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
            });

          return result;
        }
      }

      return;
    });
}

if (!module.parent) {
  getStyles({
    start: {
      fileName:
        '/Users/atifafzal/scratch/personal/meta-x/server/src/fixtures/styled-components.tsx',
      lineNumber: 12,
      columnNumber: 20,
    },
  });
}

export default getStyles;
