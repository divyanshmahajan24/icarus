import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import OverlayLayer from '@containers/OverlayLayer';
import Droppable from '@services/droppable';

const Container = styled('div')`
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
`;

const LeftPanel = styled('div')`
  width: 400px;
  background-color: #dedede;
  overflow-y: scroll;
`;

const RightPanel = styled('div')`
  width: 400px;
  overflow-y: scroll;
`;

const ComponentCard = styled('div')`
  margin-bottom: 32px;
`;

const ComponentTitle = styled('div')`
  font-weight: 600;
  font-size: 18px;
`;

const CraftingComponentWrapper = styled('div')`
  padding: 20px;
  background-color: rgba(222, 222, 222, 0.3);
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
        <RightPanel style={{ width: 400, padding: 10, overflowY: 'auto' }}>
          {this.props.Icarus &&
            this.props.Icarus.workspace.map((a, i) => (
              <ComponentCard key={a.title}>
                <ComponentTitle>{a.title}</ComponentTitle>
                <div>
                  {a.instances.map((instance, j) => (
                    <Droppable
                      onClick={() => this.props.setSelectedComponent([i, j])}
                      key={j}
                    >
                      {instance}
                    </Droppable>
                  ))}
                </div>
              </ComponentCard>
            ))}
        </RightPanel>
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
  Icarus: state.craft.Icarus,
});

const mapDispatchToProps = {
  craftingTableMounted: craftActions.craftingTableMounted,
  craftingTableUnmounted: craftActions.craftingTableUnmounted,
  setSelectedOverlay: craftActions.setSelectedOverlay,
  setSelectedStyle: craftActions.setSelectedStyle,
  handleSelectOverlayOnClick: craftActions.handleSelectOverlayOnClick,
  setSelectedComponent: craftActions.setSelectedComponent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeRoute);
