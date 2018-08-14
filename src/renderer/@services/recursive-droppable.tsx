import * as React from 'react';

import Droppable from '@services/droppable';

interface IProps {
  children?: React.ReactNode;
}

const RecursiveDroppable = (props: IProps): any => {
  if (!props.children) {
    return null;
  }

  return React.Children.map(props.children, (child: any) => {
    if (!child || !child.props) {
      return child;
    }

    if (child.props.children) {
      return (
        <Droppable>
          {React.cloneElement(child, {
            children: (
              <RecursiveDroppable>{child.props.children}</RecursiveDroppable>
            ),
          })}
        </Droppable>
      );
    }

    return <Droppable>{child}</Droppable>;
  });
};

export default RecursiveDroppable;
