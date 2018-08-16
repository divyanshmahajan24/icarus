import * as ts from 'typescript';

export { default as Replacement } from './Replacement';
export { default as findNode } from './findNode';

export const getInfo = (node: ts.Node) => {
  const file = node.getSourceFile();

  const { line, character: column } = file.getLineAndCharacterOfPosition(
    node.getStart(),
  );

  const fileName = file.fileName;
  const lineNumber = line + 1;
  const columnNumber = column + 1;

  return {
    fileName,
    lineNumber,
    columnNumber,
  };
};

export const isAncestor = (a?: ts.Node, b?: ts.Node): boolean => {
  if (!b || !a) {
    return false;
  }

  if (b.parent === a) {
    return true;
  }

  return isAncestor(a, b.parent);
};
