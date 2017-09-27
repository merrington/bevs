import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Roles } from 'meteor/alanning:roles';
import { withTracker } from 'meteor/react-meteor-data';
import { Seasons } from '/imports/api/seasons/Seasons';
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
    if (!this.props.seasonReady) {
      return 'Loading...';
    }
    return (
      <Switch>
        <Route exact path="/season/:slug" component={Standings} />
        <Route path="/season/:slug/settings" component={Settings} />
        <Route
          path="/season/:slug/voting"
          render={() => <Voting {...this.props} />}
        />
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

  const slug = props.match.params.slug;

  const seasonSubHandle = Meteor.subscribe('seasons.slug', slug);

  return {
    userIsInSeason,
    seasonReady: seasonSubHandle.ready(),
    season: Seasons.findOne({ slug })
  };
})(Season);
