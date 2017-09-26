import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import Standings from './standings/Standings';
import Settings from './settings/Settings';
import Voting from '../../pages/dashboard/Voting';

class Season extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.userIsInSeason) {
      return <Redirect to="/" />;
    }
    return (
      <Switch>
        <Route exact path="/season/:slug" component={Standings} />
        <Route path="/season/:slug/settings" component={Settings} />
        <Route path="/season/:slug/voting" component={Voting} />
      </Switch>
    );
  }
}

export default withTracker(props => {
  let userIsInSeason = true;
  if (Meteor.user() && Roles.subscription.ready()) {
    userIsInSeason = Roles.userIsInRole(
      Meteor.userId(),
      ['owner', 'player'],
      props.match.params.slug
    );
  }

  return {
    userIsInSeason
  };
})(Season);
