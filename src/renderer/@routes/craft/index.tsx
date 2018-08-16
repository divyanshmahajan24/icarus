import * as ipc from 'electron-better-ipc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'react-emotion';

import { IFiberNode, IFiberRoot, IRenderer } from '@interfaces';
import Droppable from '@services/droppable';
import setupDevToolsHook from '@services/setupDevToolsHook';

const Container = styled('div')`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
`;

const LeftPanel = styled('div')`
  width: 300px;
  background-color: white;
  overflow-y: scroll;
`;

const CraftingComponentWrapper = styled('div')`
  padding: 20px;
  background-color: #dedede;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TreeRow = styled('div')<{ depth: number }>`
  height: 32px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  margin-left: ${p => p.depth * 6}px;
  cursor: pointer;
`;

const getTitle = (node: any) =>
  node._debugSource && Object.values(node._debugSource).join(',');

const getClassNameList = (nativeNode: HTMLElement) =>
  Array.from(nativeNode.classList);

const getAffectedStyles = (selectorText: string) => {
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

interface IState {
  nodeMap: Record<
    string,
    { node: IFiberNode; nativeNode: HTMLElement; depth: number }
  >;
  renderer?: IRenderer;
  fiberRoot?: IFiberRoot;
  selectedOverlay?: string;
  selectedStyle?: CSSStyleRule;
  Icarus?: {
    workspace: Array<{ meta: { title: string; instances: JSX.Element[] } }>;
    ContextProvider: React.ComponentType;
  };
}

class HomeRoute extends React.Component<{}, IState> {
  private craftingDivRef: React.RefObject<HTMLDivElement>;

  constructor(props: {}) {
    super(props);

    this.craftingDivRef = React.createRef();

    this.state = {
      nodeMap: {},
    };
  }

  private handleDelete = () => {
    const { node } = this.state.nodeMap[this.state.selectedOverlay!];

    ipc.callMain('remove', {
      start: node._debugSource,
    });
  };

  private selectOverlay = (title?: string) => {
    this.setState({ selectedOverlay: title });

    if (title) {
      const { nativeNode } = this.state.nodeMap[title!];

      const classNameList = getClassNameList(nativeNode);

      if (classNameList.length) {
        classNameList.forEach(className => {
          const cssStyleRuleList = getAffectedStyles(className);

          cssStyleRuleList.forEach(cssStyleRule => {
            if (cssStyleRule.style.length) {
              (window as any).selectedStyle = cssStyleRule;
              this.setState({ selectedStyle: cssStyleRule });
            }
          });
        });
      } else {
        this.setState({ selectedStyle: undefined });
      }
    } else {
      this.setState({ selectedStyle: undefined });
    }
  };

  private walkTree(root: any, fn: (node: any, depth: number) => void) {
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

  public componentWillUnmount() {
    document.removeEventListener<'keydown'>(
      'keydown',
      this.keydownEventListener,
    );
  }

  private keydownEventListener = (e: KeyboardEvent) => {
    if (e.keyCode === 8 && !e.repeat && this.state.selectedOverlay) {
      this.handleDelete();
    }
  };

  public componentDidMount() {
    document.addEventListener<'keydown'>('keydown', this.keydownEventListener);

    document.addEventListener('icarus-build', e => {
      const event = e as CustomEvent<IState['Icarus']>;

      const Icarus = event.detail!;

      const craftingComponentInstance = Icarus.workspace[0].meta.instances[0];

      setupDevToolsHook(({ fiberRoot, renderer }) => {
        if (
          renderer!.findHostInstanceByFiber(fiberRoot!.current) ===
          this.craftingDivRef.current!.children[0]
        ) {
          const nodeMap: IState['nodeMap'] = {};

          this.walkTree(fiberRoot!.current, (node, depth) => {
            const title = getTitle(node);

            const nativeNode = renderer!.findHostInstanceByFiber(
              node,
            ) as HTMLElement;

            if (title) {
              nodeMap[title] = { node, nativeNode, depth };
            }
          });

          this.setState({
            nodeMap,
            renderer,
            fiberRoot,
          });
        }
      });

      ReactDOM.render(
        <Icarus.ContextProvider>
          {craftingComponentInstance}
        </Icarus.ContextProvider>,
        this.craftingDivRef.current,
      );
    });

    const script = document.createElement('script');
    script.src = 'http://localhost:9889/app.js';

    document.body.appendChild(script);
  }

  public render() {
    return (
      <Container>
        <>
          <LeftPanel>
            {Object.keys(this.state.nodeMap).map(title => {
              const { depth } = this.state.nodeMap[title];

              return (
                <TreeRow
                  key={title}
                  depth={depth}
                  title={title}
                  onClick={() => this.selectOverlay(title)}
                >
                  {depth}
                </TreeRow>
              );
            })}
          </LeftPanel>
          <CraftingComponentWrapper onClick={() => this.selectOverlay()}>
            <div ref={this.craftingDivRef} />
            {/* <StyleInspectorWrapper>
                {this.state.selectedStyle && (
                  <div>
                    {Array.from(this.state.selectedStyle.style).map(label => (
                      <div key={label}>
                        {label}:{' '}
                        {this.state.selectedStyle!.style.getPropertyValue(
                          label,
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </StyleInspectorWrapper> */}
          </CraftingComponentWrapper>
          {/* <RightContainer>
              {Object.values(Icarus.workspace)
                .filter(x => x.meta)
                .map(x => (
                  <ComponentListingContainer key={x.meta!.title}>
                    {x.meta!.title}
                    <ComponentListingList>
                      {x.meta!.instances.map((instance, i) => (
                        <ComponentListingComponentWrapper key={i}>
                          <Droppable>{instance}</Droppable>
                        </ComponentListingComponentWrapper>
                      ))}
                    </ComponentListingList>
                  </ComponentListingContainer>
                ))}
            </RightContainer> */}
          {ReactDOM.createPortal(
            <>
              {Object.keys(this.state.nodeMap).map(title => {
                const { node, nativeNode } = this.state.nodeMap[title];

                if (nativeNode.getBoundingClientRect && node._debugSource) {
                  const rect = nativeNode.getBoundingClientRect();

                  const divStyle: React.CSSProperties = {
                    left: rect.left + 'px',
                    right: rect.right + 'px',
                    top: rect.top + 'px',
                    bottom: rect.bottom + 'px',
                    height: rect.height + 'px',
                    width: rect.width + 'px',
                  };

                  if (title === this.state.selectedOverlay) {
                    divStyle.border = '1px solid blue';
                  }

                  const div = (
                    <Droppable
                      onDoubleClick={() => {
                        ipc.callMain('open-file', {
                          start: node._debugSource,
                        });
                      }}
                      onClick={() => this.selectOverlay(title)}
                      source={node._debugSource}
                      key={title}
                      title={title}
                      style={divStyle}
                    />
                  );

                  return div;
                }
                return null;
              })}
            </>,
            document.body,
          )}
        </>
      </Container>
    );
  }
}

export default HomeRoute;
