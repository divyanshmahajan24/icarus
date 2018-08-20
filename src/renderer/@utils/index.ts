export const getTitle = (node: any) =>
  node._debugSource && Object.values(node._debugSource).join(',');

export function walkTree(root: any, fn: (node: any, depth: number) => void) {
  let node = root;

  let depth = 0;

  while (true) {
    fn(node, depth);

    if (node.child) {
      node = node.child;
      depth += 1;
      continue;
    }
    if (node === root) {
      return;
    }
    while (!node.sibling) {
      if (!node.return || node.return === root) {
        return;
      }
      node = node.return;
      depth -= 1;
    }
    node = node.sibling;
  }
}

export const getClassNameList = (nativeNode: HTMLElement) =>
  Array.from(nativeNode.classList);

export const getAffectedStyles = (selectorText: string) => {
  const styles: CSSStyleRule[] = [];

  Array.from(document.styleSheets).forEach(styleSheet => {
    Array.from((styleSheet as any).cssRules).forEach((cssRule: any) => {
      if (
        cssRule.selectorText &&
        cssRule.selectorText.includes(selectorText) &&
        cssRule.style.length
      ) {
        styles.push(cssRule);
      }
    });
  });

  return styles;
};
