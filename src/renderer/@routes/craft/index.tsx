import * as React from 'react';
import styled from 'react-emotion';
import { connect } from 'react-redux';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import OverlayLayer from '@containers/OverlayLayer';
import StyleInspector from '@containers/StyleInspector';
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
  padding: 10px;
  overflow-y: scroll;
`;

const ComponentCard = styled('div')`
  margin-bottom: 32px;
`;

const ComponentTitle = styled('div')`
  font-weight: 400;
  font-size: 16px;
`;

const TabRow = styled('div')`
  display: flex;
  margin-bottom: 20px;
`;

const TabTitle = styled('div')<{ selected?: boolean }>`
  font-size: 20px;
  font-weight: 600;
  margin-right: 24px;
  cursor: pointer;
  ${p => (p.selected ? 'border-bottom: 1px solid;' : '')};
`;

const ComponentInstanceContainer = styled('div')``;

const CraftingComponentWrapper = styled('div')`
  padding: 20px;
  background-color: rgba(222, 222, 222, 0.3);
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TreeRow = styled('div')<{ depth: number }>`
  line-height: 24px;
  border-bottom: 1px solid grey;
  display: flex;
  align-items: center;
  margin-left: ${p => p.depth * 6}px;
  cursor: pointer;
  font-size: 14px;
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
        <RightPanel>
          <TabRow>
            <TabTitle
              selected={this.props.rightTab === 'components'}
              onClick={() => this.props.setRightTab('components')}
            >
              components
            </TabTitle>
            <TabTitle
              selected={this.props.rightTab === 'style'}
              onClick={() => this.props.setRightTab('style')}
            >
              style
            </TabTitle>
          </TabRow>
          {this.props.rightTab === 'components' &&
            this.props.Icarus &&
            this.props.Icarus.workspace.map((a, i) => (
              <ComponentCard key={a.title}>
                <ComponentTitle>{a.title}</ComponentTitle>
                <div>
                  {a.instances.map((instance, j) => (
                    <ComponentInstanceContainer key={j}>
                      <Droppable
                        onClick={() => this.props.setSelectedComponent([i, j])}
                      >
                        {instance}
                      </Droppable>
                    </ComponentInstanceContainer>
                  ))}
                </div>
              </ComponentCard>
            ))}
          {this.props.rightTab === 'style' && <StyleInspector />}
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
  rightTab: state.craft.rightTab,
});

const mapDispatchToProps = {
  craftingTableMounted: craftActions.craftingTableMounted,
  craftingTableUnmounted: craftActions.craftingTableUnmounted,
  setSelectedOverlay: craftActions.setSelectedOverlay,
  setSelectedStyle: craftActions.setSelectedStyle,
  handleSelectOverlayOnClick: craftActions.handleSelectOverlayOnClick,
  setSelectedComponent: craftActions.setSelectedComponent,
  setRightTab: craftActions.setRightTab,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeRoute);
