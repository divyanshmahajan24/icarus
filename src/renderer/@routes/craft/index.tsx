import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import OverlayLayer from '@containers/OverlayLayer';

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
          <OverlayLayer />
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
