import { IFiberRoot, IRenderer } from '@interfaces';

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: {
      inject: (renderer: IRenderer) => void;
      onCommitFiberRoot: (rendererId: string, fiberRoot: IFiberRoot) => void;
      onCommitFiberUnmount: any;
      supportsFiber: boolean;
    };
  }
}

interface IResult {
  rendererId: string;
  renderer: IRenderer;
  fiberRoot: IFiberRoot;
}

const renderers: Record<string, IRenderer> = {};

let onFiberRoot: ((r: IResult) => void) | undefined;

function setup(fn: typeof onFiberRoot) {
  onFiberRoot = fn;
}

window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  supportsFiber: true,
  inject: (renderer: IRenderer) => {
    const rendererId = Math.random()
      .toString()
      .slice(2);

    renderers[rendererId] = renderer;

    return rendererId;
  },
  onCommitFiberRoot: (rendererId: string, fiberRoot: IFiberRoot) => {
    const renderer = renderers[rendererId];

    if (onFiberRoot) {
      onFiberRoot({ rendererId, renderer, fiberRoot });
    }
  },
  onCommitFiberUnmount: () => null,
};

export default setup;
