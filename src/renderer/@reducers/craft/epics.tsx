import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { empty, fromEvent, BehaviorSubject } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

import { IIcarus, INodeMap, IFiberRoot, IRenderer } from '@interfaces';
import { IEpic } from '@reducers';
import setupDevToolsHook from '@services/setupDevToolsHook';
import { walkTree, getTitle } from '@utils';

import { actions } from './';

const epics: IEpic[] = [
  (action$, $state) => {
    return action$.pipe(
      filter(actions.craftingTableMounted.match),
      mergeMap(() =>
        fromEvent(document, 'icarus-build').pipe(
          mergeMap(e => {
            const event = e as CustomEvent<IIcarus>;

            const Icarus = event.detail;

            const craftingComponentInstance =
              Icarus.workspace[0].meta.instances[0];

            const {
              value: {
                craft: { craftingDivRef },
              },
            } = $state;

            const subject = new BehaviorSubject<any>(undefined);

            setupDevToolsHook(
              ({
                fiberRoot,
                renderer,
              }: {
                fiberRoot: IFiberRoot;
                renderer: IRenderer;
              }) => {
                if (
                  renderer!.findHostInstanceByFiber(fiberRoot!.current) ===
                  craftingDivRef.current!.children[0]
                ) {
                  const nodeMap: INodeMap = {};

                  walkTree(fiberRoot!.current, (node, depth) => {
                    const title = getTitle(node);

                    const nativeNode = renderer!.findHostInstanceByFiber(
                      node,
                    ) as HTMLElement;

                    if (title) {
                      nodeMap[title] = { node, nativeNode, depth };
                    }
                  });

                  return subject.next(
                    actions.afterCommitRoot({
                      nodeMap,
                      renderer,
                      fiberRoot,
                    }),
                  );
                }

                return empty();
              },
            );

            ReactDOM.render(
              <Icarus.ContextProvider>
                {craftingComponentInstance}
              </Icarus.ContextProvider>,
              craftingDivRef.current,
            );

            return subject;
          }),
        ),
      ),
    );
  },
];

export default combineEpics(...epics);
