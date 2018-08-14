import '@services/setupDevToolsHook';

import * as React from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import Routes from '@routes';
import store from '@store';

ReactDOM.render(
  <DragDropContextProvider backend={HTML5Backend}>
    <Provider store={store as any}>
      <HashRouter>
        <Routes />
      </HashRouter>
    </Provider>
  </DragDropContextProvider>,
  document.getElementById('app'),
);

if (module.hot) {
  module.hot.accept();
}
