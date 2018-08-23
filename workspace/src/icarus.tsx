import * as React from 'react';
import { injectGlobal } from 'styled-components';

import Page from './components/Page';
import Seeker from './components/Seeker';
import AlbumArt from './components/AlbumArt';

export const ContextProvider = props => props.children;

// tslint:disable-next-line no-unused-expression
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
    title: 'Page',
    instances: [<Page />],
  },
  {
    title: 'Album Art',
    instances: [
      <div style={{ width: 200, height: 200, padding: 20 }}>
        <AlbumArt src="https://images-na.ssl-images-amazon.com/images/I/819e05qxPEL._SX522_.jpg" />
      </div>,
    ],
  },
  {
    title: 'Seeker',
    instances: [<Seeker />],
  },
];

const event = new CustomEvent('icarus-build', {
  detail: { workspace, ContextProvider },
});

document.dispatchEvent(event);
