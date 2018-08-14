import * as React from 'react';
import { injectGlobal } from 'styled-components';

import Page from './components/Page';

export const ContextProvider = props => props.children;

injectGlobal`
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:400,700');

body {
  font-family: 'IBM Plex Sans', sans-serif;
}

* {
  box-sizing: border-box;
}
`;

export const workspace = [
  {
    meta: {
      title: 'Page',
      instances: [<Page />]
    }
  }
];

const event = new CustomEvent('icarus-build', {
  detail: { workspace, ContextProvider }
});

document.dispatchEvent(event);
