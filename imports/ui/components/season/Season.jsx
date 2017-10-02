import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Seasons } from '/imports/api/seasons/Seasons';
import get from 'lodash/get';
import Standings from './standings/Standings';
import Settings from './settings/Settings';
import Voting from '../../pages/dashboard/Voting';

class Season extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.userReady || !this.props.seasonReady) {
      return 'Loading...';
    } else if (!this.props.userIsInSeason) {
      return <Redirect to="/" />;
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
  const slug = props.match.params.slug;
  const userSubHandle = Meteor.subscribe('userData');
  Meteor.subscribe('users.season', slug);

  const userIsInSeason = get(Meteor.user(), 'seasons', []).find(
    season => season.slug === slug
  );

  const seasonSubHandle = Meteor.subscribe('seasons.slug', slug);

  return {
    userIsInSeason,
    userReady: userSubHandle.ready(),
    seasonReady: seasonSubHandle.ready(),
    season: Seasons.findOne({ slug })
  };
})(Season);
