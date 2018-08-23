import actionCreatorFactory from 'typescript-fsa';

import { IFiberRoot, INodeMap, IRenderer, IIcarus } from '@interfaces';

const actionCreator = actionCreatorFactory('CRAFT');

const actions = {
  craftingTableMounted: actionCreator('craftingTableMounted'),
  craftingTableUnmounted: actionCreator('craftingTableUnmounted'),
  afterCommitRoot: actionCreator<{
    nodeMap: INodeMap;
    renderer: IRenderer;
    fiberRoot: IFiberRoot;
  }>('afterCommitRoot'),
  updateIcarus: actionCreator<IIcarus>('updateIcarus'),
  setSelectedOverlay: actionCreator<string | undefined>('setSelectedOverlay'),
  setSelectedStyle: actionCreator<CSSStyleRule | undefined>('setSelectedStyle'),
  handleSelectOverlayOnClick: actionCreator<string | undefined>(
    'handleSelectOverlayOnClick',
  ),
};

export default actions;
