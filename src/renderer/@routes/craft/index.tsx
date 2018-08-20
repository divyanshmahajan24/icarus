import * as ipc from 'electron-better-ipc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'react-emotion';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import Droppable from '@services/droppable';
import { connect } from 'react-redux';
import { getClassNameList, getAffectedStyles } from '@utils';

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

type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface IState {
  selectedOverlay?: string;
  selectedStyle?: CSSStyleRule;
}

class HomeRoute extends React.Component<IProps, IState> {
  public state: IState = {};

  private handleDelete = () => {
    const { node } = this.props.nodeMap[this.state.selectedOverlay!];

    ipc.callMain('remove', {
      start: node._debugSource,
    });
  };

  private selectOverlay = (title?: string) => {
    this.setState({ selectedOverlay: title });

    if (title) {
      const { nativeNode } = this.props.nodeMap[title!];

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
    this.props.craftingTableMounted();

    document.addEventListener<'keydown'>('keydown', this.keydownEventListener);

    const script = document.createElement('script');
    script.src = 'http://localhost:9889/app.js';

    document.body.appendChild(script);
  }

  public render() {
    return (
      <Container>
        <>
          <LeftPanel>
            {Object.keys(this.props.nodeMap).map(title => {
              const { depth, node } = this.props.nodeMap[title];

              return (
                <TreeRow
                  key={title}
                  depth={depth}
                  title={title}
                  onClick={() => this.selectOverlay(title)}
                >
                  {node._debugSource!.tagName}
                </TreeRow>
              );
            })}
          </LeftPanel>
          <CraftingComponentWrapper onClick={() => this.selectOverlay()}>
            <div ref={this.props.craftingDivRef} />
          </CraftingComponentWrapper>
          {ReactDOM.createPortal(
            <>
              {Object.keys(this.props.nodeMap).map(title => {
                const { node, nativeNode } = this.props.nodeMap[title];

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

const mapStateToProps = (state: IRootState) => ({
  craftingDivRef: state.craft.craftingDivRef,
  nodeMap: state.craft.nodeMap,
  renderer: state.craft.renderer,
  fiberRoot: state.craft.fiberRoot,
});

const mapDispatchToProps = {
  craftingTableMounted: craftActions.craftingTableMounted,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeRoute);
