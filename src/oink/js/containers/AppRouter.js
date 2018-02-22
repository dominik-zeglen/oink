import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import IndexSection from './IndexSection';
import LoginSection from './LoginSection';
import ObjectSection from './ObjectSection';

function AppRouter(props) {
  return (
    <div>
      {props.loggedUser ? (
        <Switch>
          <Route
            path="/"
            exact
            component={IndexSection}
          />
          <Route
            path="/objects/"
            exact
            component={ObjectSection}
          />
        </Switch>
    ) : (
      <Route
        path="/"
        component={LoginSection}
      />
    )}
    </div>
  );
}

export default withRouter(AppRouter);
