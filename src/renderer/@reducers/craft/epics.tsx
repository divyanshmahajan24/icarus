import * as ipc from 'electron-better-ipc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { empty, fromEvent, BehaviorSubject, merge } from 'rxjs';
import { filter, mergeMap, map, takeUntil } from 'rxjs/operators';

import { IIcarus, INodeMap, IFiberRoot, IRenderer } from '@interfaces';
import { IEpic } from '@reducers';
import setupDevToolsHook from '@services/setupDevToolsHook';
import { walkTree, getTitle } from '@utils';

import { actions } from './';

const epics: IEpic[] = [
  action$ =>
    action$.pipe(
      filter(actions.handleSelectOverlayOnClick.match),
      map(({ payload: title }) => actions.setSelectedOverlay(title)),
    ),
  (action$, $state) =>
    action$.pipe(
      filter(actions.craftingTableMounted.match),
      mergeMap(() => {
        const script = document.createElement('script');
        script.src = 'http://localhost:9889/app.js';

        document.body.appendChild(script);

        return merge(
          fromEvent(document, 'keydown').pipe(
            mergeMap((e: KeyboardEvent) => {
              const {
                craft: { selectedOverlay, nodeMap },
              } = $state.value;

              if (e.keyCode === 8 && !e.repeat && selectedOverlay) {
                const { node } = nodeMap[selectedOverlay!];

                ipc.callMain('remove', {
                  start: node._debugSource,
                });
              }

              return empty();
            }),
            takeUntil(
              action$.pipe(filter(actions.craftingTableUnmounted.match)),
            ),
          ),
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
        );
      }),
    ),
];

export default combineEpics(...epics);
