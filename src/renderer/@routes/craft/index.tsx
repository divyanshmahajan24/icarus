import * as ipc from 'electron-better-ipc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'react-emotion';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import Droppable from '@services/droppable';
import { connect } from 'react-redux';

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

class HomeRoute extends React.Component<IProps> {
  public componentWillUnmount() {
    this.props.craftingTableUnmounted();
  }

  public componentDidMount() {
    this.props.craftingTableMounted();
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
                  onClick={() => this.props.handleSelectOverlayOnClick(title)}
                >
                  {node._debugSource!.tagName}
                </TreeRow>
              );
            })}
          </LeftPanel>
          <CraftingComponentWrapper
            onClick={() => this.props.handleSelectOverlayOnClick(undefined)}
          >
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

                  if (title === this.props.selectedOverlay) {
                    divStyle.border = '1px solid blue';
                  }

                  const div = (
                    <Droppable
                      onDoubleClick={() => {
                        ipc.callMain('open-file', {
                          start: node._debugSource,
                        });
                      }}
                      onClick={() =>
                        this.props.handleSelectOverlayOnClick(title)
                      }
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
  selectedOverlay: state.craft.selectedOverlay,
  selectedStyle: state.craft.selectedStyle,
});

const mapDispatchToProps = {
  craftingTableMounted: craftActions.craftingTableMounted,
  craftingTableUnmounted: craftActions.craftingTableUnmounted,
  setSelectedOverlay: craftActions.setSelectedOverlay,
  setSelectedStyle: craftActions.setSelectedStyle,
  handleSelectOverlayOnClick: craftActions.handleSelectOverlayOnClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeRoute);
