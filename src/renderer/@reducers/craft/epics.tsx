import * as ipc from 'electron-better-ipc';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { combineEpics } from 'redux-observable';
import { empty, fromEvent, BehaviorSubject, merge, of, from } from 'rxjs';
import { filter, mergeMap, takeUntil } from 'rxjs/operators';

import { IIcarus, INodeMap, IFiberRoot, IRenderer } from '@interfaces';
import { IEpic } from '@reducers';
import setupDevToolsHook from '@services/setupDevToolsHook';
import { walkTree, getTitle } from '@utils';

import { actions } from './';

const epics: IEpic[] = [
  (action$, state$) =>
    action$.pipe(
      filter(actions.handleSelectOverlayOnClick.match),
      mergeMap(({ payload: title }) => {
        const {
          craft: { nodeMap },
        } = state$.value;

        if (!title) {
          return empty();
        }

        const { node } = nodeMap[title];

        return merge(
          of(actions.setSelectedOverlay(title)),
          from(
            ipc.callMain('get-styles', {
              start: node._debugSource,
            }),
          ).pipe(
            mergeMap(response => {
              console.log(response);

              return empty();
            }),
          ),
        );
      }),
    ),
  (action$, $state) =>
    action$.pipe(
      filter(actions.setSelectedComponent.match),
      mergeMap(({ payload: selectedComponentInstance }) => {
        const {
          craft: { Icarus, craftingDivRef },
        } = $state.value;

        if (!selectedComponentInstance || !Icarus) {
          return empty();
        }

        const craftingComponentInstance =
          Icarus.workspace[selectedComponentInstance[0]].instances[
            selectedComponentInstance[1]
          ];

        ReactDOM.render(
          <Icarus.ContextProvider>
            {craftingComponentInstance}
          </Icarus.ContextProvider>,
          craftingDivRef.current,
        );

        return empty();
      }),
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

              const {
                value: {
                  craft: { craftingDivRef, selectedComponentInstance },
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

              if (selectedComponentInstance) {
                const craftingComponentInstance =
                  Icarus.workspace[selectedComponentInstance[0]].instances[
                    selectedComponentInstance[1]
                  ];

                ReactDOM.render(
                  <Icarus.ContextProvider>
                    {craftingComponentInstance}
                  </Icarus.ContextProvider>,
                  craftingDivRef.current,
                );
              }

              return merge(subject, of(actions.updateIcarus(Icarus)));
            }),
          ),
        );
      }),
    ),
];

export default combineEpics(...epics);
