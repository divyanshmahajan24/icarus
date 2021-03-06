import actionCreatorFactory from 'typescript-fsa';

import { IJSXSource } from '@interfaces';

const actionCreator = actionCreatorFactory('DRAG');

const actions = {
  updateDragStartLocation: actionCreator<IJSXSource>('updateDragStartLocation'),
  updateDragEndLocation: actionCreator<IJSXSource>('updateDragEndLocation'),
};

export default actions;
