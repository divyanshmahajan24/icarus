import actionCreatorFactory from 'typescript-fsa';

import { IFiberRoot, INodeMap, IRenderer } from '@interfaces';

const actionCreator = actionCreatorFactory('CRAFT');

const actions = {
  craftingTableMounted: actionCreator('craftingTableMounted'),
  afterCommitRoot: actionCreator<{
    nodeMap: INodeMap;
    renderer: IRenderer;
    fiberRoot: IFiberRoot;
  }>('afterCommitRoot'),
};

export default actions;
