import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { IJSXSource } from '@interfaces';
import actions from './actions';

export interface IReducerState {
  start?: IJSXSource;
  end?: IJSXSource;
}

const INITIAL_STATE: IReducerState = {};

const reducer = reducerWithInitialState<IReducerState>(INITIAL_STATE)
  .case(actions.updateDragStartLocation, (state, payload): IReducerState => ({
    ...state,
    start: payload,
  }))
  .case(actions.updateDragEndLocation, (state, payload): IReducerState => ({
    ...state,
    end: payload,
  }))
  .build();

export default reducer;
