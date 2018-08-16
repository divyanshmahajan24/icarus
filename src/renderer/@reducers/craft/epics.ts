import * as ipc from 'electron-better-ipc';
import { combineEpics } from 'redux-observable';
import { bindCallback, empty, fromEvent, merge } from 'rxjs';
import { filter, flatMap, mergeMap } from 'rxjs/operators';

import { IIcarus } from '@interfaces';
import { IEpic } from '@reducers';
import setupDevToolsHook from '@services/setupDevToolsHook';

import { actions } from './';

const epics: IEpic[] = [
  () => {
    return fromEvent(document, 'icarus-build').pipe(
      flatMap(e => {
        const event = e as CustomEvent<IIcarus>;

        console.log(event.detail);

        return merge(
          empty(),
          bindCallback(setupDevToolsHook)().pipe(mergeMap(() => empty())),
        );
      }),
    );
  },
  (action$, $state) =>
    action$.pipe(
      filter(actions.updateDragEndLocation.match),
      mergeMap(() => {
        const {
          drag: { start, end },
        } = $state.value;

        if (start !== end) {
          ipc.callMain('drag-drop', {
            start,
            end,
          });
        }

        return empty();
      }),
    ),
];

export default combineEpics(...epics);
