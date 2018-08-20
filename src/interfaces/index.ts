export interface IJSXSource {
  fileName: string;
  lineNumber: number;
  columnNumber: number;
}

export interface IFiberNode {
  alternate: IFiberNode;
  child: IFiberNode;
  effectTag: number;
  expirationTime: number;
  firstEffect: IFiberNode;
  index: number;
  key: null;
  lastEffect: IFiberNode;
  memoizedProps: Record<string, any>;
  memoizedState: Record<string, any>;
  mode: number;
  nextEffect: null;
  pendingProps: Record<string, any>;
  ref: null;
  return: IFiberNode;
  sibling: IFiberNode;
  stateNode: IFiberRoot;
  tag: number;
  type: null;
  updateQueue: null;
  _debugID: number;
  _debugIsCurrentlyTiming: boolean;
  _debugOwner: null;
  _debugSource?: {
    lineNumber: number;
    columnNumber: number;
    fileName: string;
    tagName: string;
  };
}

export interface IFiberRoot {
  containerInfo: HTMLElement;
  context: object;
  current: IFiberNode;
  finishedWork: null;
  firstBatch: null;
  hydrate: boolean;
  nextScheduledRoot: null;
  pendingChildren: null;
  pendingCommitExpirationTime: number;
  pendingContext: null;
  remainingExpirationTime: number;
}

export interface IRenderer {
  bundleType: number;
  findFiberByHostInstance: (el: HTMLElement) => IFiberNode;
  findHostInstanceByFiber: (node: IFiberNode) => HTMLElement;
  rendererPackageName: 'react-dom';
  version: string;
}

export interface IIcarus {
  workspace: Array<{ meta: { title: string; instances: JSX.Element[] } }>;
  ContextProvider: React.ComponentType;
}
