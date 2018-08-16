import * as ts from 'typescript';
import { IJSXSource } from '../interfaces';
import { getInfo } from '../utils';

export default (
  rootNode: ts.Node,
  target?: IJSXSource,
  predicate?: (node: ts.Node) => boolean,
): ts.Node | undefined => {
  let resolvedNode;

  function _traverse(node: ts.Node) {
    const { lineNumber, columnNumber } = getInfo(node);

    if (
      (target &&
        (lineNumber === target.lineNumber &&
          columnNumber === target.columnNumber)) ||
      (predicate && predicate(node))
    ) {
      resolvedNode = node;
      return;
    }

    ts.forEachChild(node, _traverse);
  }

  _traverse(rootNode);

  return resolvedNode;
};
