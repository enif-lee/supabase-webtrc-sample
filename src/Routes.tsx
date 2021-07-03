import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App';
import Auth from './Auth';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/auth" component={Auth} />
      </Switch>
    </Router>
  );
}

export default Routes;
