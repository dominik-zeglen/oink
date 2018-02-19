import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import IndexSection from './IndexSection';
import LoginSection from './LoginSection';

const Router = props => (
  <Switch>
    { props.loggedUser ? (
      <Route
        path="/"
        exact
        component={IndexSection}
      />
    ) : (
      <Route
        path="/"
        component={LoginSection}
      />
    )}
  </Switch>
);

export default withRouter(Router);
