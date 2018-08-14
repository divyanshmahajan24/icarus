import * as React from 'react';
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DropTarget,
} from 'react-dnd';
import { findDOMNode } from 'react-dom';
import styled from 'react-emotion';
import { Omit } from 'utility-types';

import actions from '@reducers/drag/actions';
import store from '@store';

type IDivProps = Omit<JSX.IntrinsicElements['div'], 'ref'>;

const Wrapper = styled('div')`
  ${(props: { isOver?: boolean; children?: any }) =>
    `
    ${
      props.isOver
        ? `
          background-color: hotpink;
          opacity: 0.7;
          `
        : ''
    }
  `};

  ${props =>
    !props.children
      ? `position: fixed;

        &:hover {
          border: 1px solid black;
          border-style: dotted;
        }`
      : ''};
`;

interface IDndSourceProps {
  connectDragSource: ConnectDragSource;
  isDragging: boolean;
}

interface IDndTargetProps {
  connectDropTarget: ConnectDropTarget;
  isOver: boolean;
}

interface IProps
  extends IDivProps,
    Partial<IDndSourceProps>,
    Partial<IDndTargetProps> {
  children?: React.ReactElement<any>;
  isDragging?: boolean;
  source?: any;
}

@DragSource<IProps>(
  'BOX',
  {
    beginDrag(_, __, component) {
      const source =
        component!.props.source || (component!.props.children! as any)._source;
      store.dispatch(actions.updateDragStartLocation(source));
      return {};
    },
  },
  (connect, monitor): IDndSourceProps => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }),
)
@DropTarget<IProps>(
  'BOX',
  {
    drop(props, monitor) {
      const source = props.source || (props.children! as any)._source;
      const isOver = monitor.isOver();

      if (isOver) {
        store.dispatch(actions.updateDragEndLocation(source));
      }
    },
  },
  (connect, monitor): IDndTargetProps => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
  }),
)
class Droppable extends React.Component<IProps, never> {
  public render() {
    const { connectDragSource, connectDropTarget, ...rest } = this.props;

    return (
      <Wrapper
        innerRef={(instance: any) => {
          const node = findDOMNode(instance) as any;
          connectDragSource!(node);
          connectDropTarget!(node);
        }}
        {...rest}
      />
    );
  }
}

export default Droppable;
