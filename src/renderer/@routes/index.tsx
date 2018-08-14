import * as React from 'react';
import { Route } from 'react-router-dom';

import CraftRoute from './craft';

export default () => (
  <>
    <Route exact path="/" component={CraftRoute} />
  </>
);
