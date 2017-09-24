import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Standings from './standings/Standings';
import Settings from './settings/Settings';

export default class Season extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/:slug" component={Standings} />
        <Route path="/:slug/settings" component={Settings} />
      </Switch>
    );
  }
}
