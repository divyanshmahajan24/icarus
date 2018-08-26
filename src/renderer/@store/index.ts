import { applyMiddleware, createStore, Middleware, Store } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { IRootAction, IRootState, rootEpic, rootReducer } from '@reducers';

export const epicMiddleware = createEpicMiddleware<IRootAction>();

const configureStore = (): Store<IRootState, IRootAction> => {
  const middlewares: Middleware[] = [epicMiddleware];

  if (process.env.NODE_ENV !== 'production') {
    const reduxLogger = createLogger({ collapsed: true });
    middlewares.push(reduxLogger);
  }

  const s = createStore<IRootState, IRootAction, any, any>(
    rootReducer,
    applyMiddleware(...middlewares),
  );

  epicMiddleware.run(rootEpic as any);

  return s;
};

const store = configureStore();

const epic$ = new BehaviorSubject(rootEpic);
// Every time a new epic is given to epic$ it
// will unsubscribe from the previous one then
// call and subscribe to the new one because of
// how switchMap works
const hotReloadingEpic = (...args: any[]) =>
  epic$.pipe(switchMap(epic => epic(args[0], args[1], args[2])));

epicMiddleware.run(hotReloadingEpic);

if (process.env.NODE_ENV !== 'production') {
  (window as any).store = store;

  if (module.hot) {
    module.hot.accept('@reducers', () => {
      store.replaceReducer(require('@reducers').rootReducer);
      epic$.next(require('@reducers').rootEpic);
    });
  }
}

export default store;
