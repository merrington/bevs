import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Standings from './standings/Standings';
import Settings from './settings/Settings';

export default class Season extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.match);
  }

  render() {
    return (
      <Switch>
        <Route exact path={`${this.props.match.url}`} component={Standings} />
        <Route path={`${this.props.match.url}/settings`} component={Settings} />
      </Switch>
    );
  }
}
