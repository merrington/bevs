import React from 'react';
import NewSeasonModal from './NewSeasonModal';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Roles } from 'meteor/alanning:roles';
import { Seasons } from '/imports/api/seasons/Seasons';

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

  renderSeasons(filterFun) {
    return this.props.seasons.filter(filterFun).map(season => (
      <div
        className="column is-one-quarter-desktop is-half-tablet is-half-mobile"
        key={season._id}
      >
        <div className="card">
          <header className="card-header">
            <p className="card-header-title">{season.name}</p>
          </header>
          <div className="card-content">Position: Leader:</div>
          <footer className="card-footer">
            <Link to={`/${season.slug}`} className="card-footer-item">
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
        <h3 className="subtitle is-4">Active Seasons</h3>
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
                    <NewSeasonModal closeModal={this.closeModal} />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="subtitle is-4">Past Seasons</h3>
        <div className="columns is-mobile is-multiline">
          {this.renderSeasons(season => season.status === 'finished')}
        </div>
      </div>
    );
  }
}

export default (SeasonListContainer = withTracker(() => {
  const seasonsHandle = Meteor.subscribe('seasons.user');
  const seasonsReady = seasonsHandle.ready();
  const slugs = Roles.getGroupsForUser(Meteor.userId());
  const seasons = Seasons.find({ slug: { $in: slugs } }).fetch();

  return {
    seasonsHandle,
    seasonsReady,
    seasons
  };
})(SeasonList));
