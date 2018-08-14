import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import ReduxLogger from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';

import { IRootAction, IRootState, rootEpic, rootReducer } from '@reducers';

export const epicMiddleware = createEpicMiddleware<IRootAction>();

const configureStore = (): Store<IRootState, IRootAction> => {
  const middlewares: Middleware[] = [epicMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(ReduxLogger);
  }

  const s = createStore<IRootState, IRootAction, any, any>(
    rootReducer,
    applyMiddleware(...middlewares),
  );

  epicMiddleware.run(rootEpic as any);

  return s;
};

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  (window as any).store = store;
}

export default store;