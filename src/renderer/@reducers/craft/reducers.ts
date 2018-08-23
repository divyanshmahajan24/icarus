import * as React from 'react';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { IFiberNode, IFiberRoot, IRenderer, IIcarus } from '@interfaces';
import actions from './actions';

export interface IReducerState {
  nodeMap: Record<
    string,
    { node: IFiberNode; nativeNode: HTMLElement; depth: number }
  >;
  renderer?: IRenderer;
  fiberRoot?: IFiberRoot;
  selectedOverlay?: string;
  selectedStyle?: CSSStyleRule;
  Icarus?: IIcarus;
  craftingDivRef: React.RefObject<HTMLDivElement>;
  /**
   * first number is component index, second number is instance index
   */
  selectedComponentInstance?: [number, number];
}

const INITIAL_STATE: IReducerState = {
  nodeMap: {},
  craftingDivRef: React.createRef(),
  selectedComponentInstance: [0, 0],
};

const reducer = reducerWithInitialState<IReducerState>(INITIAL_STATE)
  .case(
    actions.afterCommitRoot,
    (state, payload): IReducerState => ({
      ...state,
      ...payload,
    }),
  )
  .case(
    actions.setSelectedOverlay,
    (state, payload): IReducerState => ({
      ...state,
      selectedOverlay: payload,
    }),
  )
  .case(
    actions.setSelectedStyle,
    (state, payload): IReducerState => ({
      ...state,
      selectedStyle: payload,
    }),
  )
  .case(
    actions.updateIcarus,
    (state, payload): IReducerState => ({
      ...state,
      Icarus: payload,
    }),
  )
  .case(
    actions.setSelectedComponent,
    (state, payload): IReducerState => ({
      ...state,
      selectedComponentInstance: payload,
    }),
  )
  .build();

export default reducer;
