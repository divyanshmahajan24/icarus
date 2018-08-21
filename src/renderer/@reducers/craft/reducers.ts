import * as React from 'react';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { IFiberNode, IFiberRoot, IRenderer } from '@interfaces';
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
  Icarus?: {
    workspace: Array<{ meta: { title: string; instances: JSX.Element[] } }>;
    ContextProvider: React.ComponentType;
  };
  craftingDivRef: React.RefObject<HTMLDivElement>;
}

const INITIAL_STATE: IReducerState = {
  nodeMap: {},
  craftingDivRef: React.createRef(),
};

const reducer = reducerWithInitialState<IReducerState>(INITIAL_STATE)
  .case(actions.afterCommitRoot, (state, payload) => ({
    ...state,
    ...payload,
  }))
  .case(actions.setSelectedOverlay, (state, payload) => ({
    ...state,
    selectedOverlay: payload,
  }))
  .case(actions.setSelectedStyle, (state, payload) => ({
    ...state,
    selectedStyle: payload,
  }))
  .build();

export default reducer;
