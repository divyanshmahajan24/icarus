import { combineReducers } from 'redux';
import { Epic, combineEpics } from 'redux-observable';
import { ActionType, StateType } from 'typesafe-actions';
import {
  actions as craftActions,
  epics as craftEpics,
  reducers as craftReducers,
} from './craft';
import {
  actions as dragActions,
  epics as dragEpics,
  reducers as dragReducers,
} from './drag';

export const rootEpic = combineEpics(craftEpics, dragEpics);

export const rootReducer = combineReducers({
  craft: craftReducers,
  drag: dragReducers,
});

export type IRootState = StateType<typeof rootReducer>;

export type IRootAction =
  | ActionType<typeof craftActions>
  | ActionType<typeof dragActions>;

export type IEpic = Epic<IRootAction, IRootAction, IRootState>;
