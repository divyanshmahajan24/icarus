import axios from 'axios';
import { combineEpics } from 'redux-observable';
import { empty } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { IEpic } from '@reducers';

import { actions } from './';

const epics: IEpic[] = [
  (action$, $state) =>
    action$.pipe(
      filter(actions.updateDragEndLocation.match),
      mergeMap(() => {
        const {
          drag: { start, end },
        } = $state.value;

        if (start !== end) {
          axios.put('/api/drag-drop', {
            start,
            end,
          });
        }

        return empty();
      }),
    ),
];

export default combineEpics(...epics);
