import * as ts from 'typescript';
import findNode from './findNode';

const getTemplateText = (
  sourceFile: ts.SourceFile,
  tagName: string,
): string | undefined => {
  const variableDeclaration = findNode(
    sourceFile,
    undefined,
    node => ts.isVariableDeclaration(node) && node.name.getText() === tagName,
  );

  if (!variableDeclaration) {
    return;
  }

  const initializer = (variableDeclaration as ts.VariableDeclaration)
    .initializer;

  if (initializer && ts.isTaggedTemplateExpression(initializer)) {
    if (ts.isTemplateExpression(initializer.template)) {
      return (
        initializer.template.head.text +
        initializer.template.templateSpans
          .filter(span => ts.isTemplateMiddleOrTemplateTail(span.literal))
          .map(x => x.literal.text)
          .join('')
      );
    }

    return initializer.template.text;
  }

  return;
};

export default getTemplateText;
