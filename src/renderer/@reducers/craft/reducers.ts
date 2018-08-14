import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { IFiberNode, IFiberRoot, IRenderer } from '@interfaces';
// import actions from './actions';

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
}

const INITIAL_STATE: IReducerState = {
  nodeMap: {},
};

const reducer = reducerWithInitialState<IReducerState>(INITIAL_STATE).build();

export default reducer;
