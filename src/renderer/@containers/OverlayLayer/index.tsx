import * as ipc from 'electron-better-ipc';
import styled from 'react-emotion';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import { IRootState } from '@reducers';
import craftActions from '@reducers/craft/actions';
import Droppable from '@services/droppable';

type IProps = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Overlay = styled(Droppable)`
  position: fixed;

  &:hover {
    border: 1px solid black;
    border-style: dotted;
  }
`;

const OverlayLayer: React.SFC<IProps> = props => {
  return (
    <>
      {ReactDOM.createPortal(
        <>
          {Object.keys(props.nodeMap).map(title => {
            const { node, nativeNode } = props.nodeMap[title];

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

              if (title === props.selectedOverlay) {
                divStyle.border = '1px solid blue';
              }

              const div = (
                <Overlay
                  onDoubleClick={() => {
                    ipc.callMain('open-file', {
                      start: node._debugSource,
                    });
                  }}
                  onClick={() => props.handleSelectOverlayOnClick(title)}
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
  );
};

const mapStateToProps = (state: IRootState) => ({
  nodeMap: state.craft.nodeMap,
  selectedOverlay: state.craft.selectedOverlay,
});

const mapDispatchToProps = {
  handleSelectOverlayOnClick: craftActions.handleSelectOverlayOnClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OverlayLayer);
