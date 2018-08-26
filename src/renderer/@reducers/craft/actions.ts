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
  setSelectedComponent: actionCreator<[number, number] | undefined>(
    'setSelectedComponent',
  ),
  updateIcarus: actionCreator<IIcarus>('updateIcarus'),
  setSelectedOverlay: actionCreator<string | undefined>('setSelectedOverlay'),
  setSelectedStyle: actionCreator<Record<string, string> | undefined>(
    'setSelectedStyle',
  ),
  handleSelectOverlayOnClick: actionCreator<string | undefined>(
    'handleSelectOverlayOnClick',
  ),
  setRightTab: actionCreator<'components' | 'style'>('setRightTab'),
};

export default actions;
