import React from 'react';
import NewSeasonModal from './NewSeasonModal';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Seasons } from '/imports/api/seasons/Seasons';
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import get from 'lodash/get';

class SeasonList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showNewSeasonModal: false,
      newSeasonName: ''
    };

    //bind methods
    this.clickNewSeason = this.clickNewSeason.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.renderActiveSeasons = this.renderSeasons.bind(this);
  }

  clickNewSeason() {
    this.setState(prevState => ({
      ...prevState,
      showNewSeasonModal: !prevState.showNewSeasonModal
    }));
  }

  closeModal() {
    this.setState({
      showNewSeasonModal: false
    });
  }

  getSeasonUsers(season) {
    return this.props.users
      .filter(user => this.getUserSeason(user, season))
      .sort((user1, user2) => {
        const season1 = this.getUserSeason(user1, season);
        const season2 = this.getUserSeason(user2, season);

        return season2.points || 0 - season1.points || 0;
      });
  }

  getUserSeason(user, season) {
    return user.seasons.find(userSeason => userSeason.slug === season.slug);
  }

  getPosition(season) {
    //get all of the users of the season
    const users = this.getSeasonUsers(season);

    //find the position of the user and their season information
    const idx = users.findIndex(user => user._id === Meteor.userId());
    const userSeason = this.getUserSeason(Meteor.user(), season);

    return (
      <span>
        {idx + 1} ({userSeason.points || 0} points)
      </span>
    );
  }

  getLeader(season) {
    const users = this.getSeasonUsers(season);
    const userSeason = this.getUserSeason(users[0], season);

    return (
      <span>
        {users[0].profile.name} ({userSeason.points || 0} points)
      </span>
    );
  }

  getLastVote(season) {
    if (season.history && season.history.length) {
      return `${distanceInWordsToNow(
        season.history.splice(season.history.length - 1)[0].date
      )} ago`;
    }
    return 'Never';
  }

  renderSeasons(filterFun) {
    return this.props.seasons.filter(filterFun).map(season => (
      <div
        className="column is-half-desktop is-half-tablet is-full-mobile"
        key={season._id}
      >
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">{season.name}</p>
          </header>
          <div className="card-content">
            <nav className="level">
              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Position</p>
                  <p className="title is-5">{this.getPosition(season)}</p>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Leader</p>
                  <p className="title is-5">{this.getLeader(season)}</p>
                </div>
              </div>

              <div className="level-item has-text-centered">
                <div>
                  <p className="heading">Last Vote</p>
                  <p className="title is-5">{this.getLastVote(season)}</p>
                </div>
              </div>
            </nav>
          </div>
          <footer className="card-footer">
            <Link to={`/season/${season.slug}`} className="card-footer-item">
              Go to season
            </Link>
          </footer>
        </div>
      </div>
    ));
  }

  render() {
    return (
      <div className="container">
        <h3 className="title">Active Seasons</h3>
        <div className="columns is-mobile is-multiline">
          {this.props.seasonsReady ? (
            this.renderSeasons(
              season => !season.status || season.status !== 'finished'
            )
          ) : (
            <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
              <div className="card">
                <div className="card-content">Loading</div>
              </div>
            </div>
          )}
          <div className="column is-one-quarter-desktop is-half-tablet is-half-mobile">
            <div className="card">
              <div className="card-content">
                <div className="content has-text-centered">
                  <a
                    className="button is-medium is-primary"
                    onClick={this.clickNewSeason}
                  >
                    <span className="icon is-small">
                      <i className="fa fa-plus" />
                    </span>
                    <span>New Season</span>
                  </a>
                  {this.state.showNewSeasonModal ? (
                    <NewSeasonModal
                      closeModal={this.closeModal}
                      history={this.props.history}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="title">Past Seasons</h3>
        <div className="columns is-mobile is-multiline">
          {this.renderSeasons(season => season.status === 'finished')}
        </div>
      </div>
    );
  }
}

export default (SeasonListContainer = withTracker(() => {
  Meteor.subscribe('userData');
  const seasonsHandle = Meteor.subscribe('seasons.user');
  const seasonsReady = seasonsHandle.ready();
  const slugs = get(Meteor.user(), 'seasons', []).map(season => season.slug);
  const seasons = Seasons.find({ slug: { $in: slugs } }).fetch();
  slugs.forEach(slug => {
    Meteor.subscribe('users.season', slug);
  });

  return {
    seasonsHandle,
    seasonsReady,
    seasons,
    users: Meteor.users.find().fetch()
  };
})(SeasonList));
