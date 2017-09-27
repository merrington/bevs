import React from 'react';
import BeerList from '../../beerList/BeerList';
import BeerSearch from './BeerSearch';
import get from 'lodash/get';
import {
  addBeer as addBeerMethod,
  deleteBeer as deleteBeerMethod,
  updateSetting,
  startSeason
} from '/imports/api/seasons/methods';
import { Seasons } from '/imports/api/seasons/Seasons';
import { withTracker } from 'meteor/react-meteor-data';
import { sendInvite } from '/imports/api/invites/methods';
import UserMedia from '../../userMedia/UserMedia';
import Portal from 'react-portal';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showInvite: false
    };

    this.addBeer = this.addBeer.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.closeSavedPortal = this.closeSavedPortal.bind(this);
    this.closeErrorPortal = this.closeErrorPortal.bind(this);
    this.toggleShowInvite = this.toggleShowInvite.bind(this);
    this.updateInviteEmail = this.updateInviteEmail.bind(this);
    this.sendInvite = this.sendInvite.bind(this);
    this.startSeason = this.startSeason.bind(this);
  }

  addBeer(beer) {
    if (beer && beer.beer) {
      addBeerMethod.call(
        {
          beer: beer.beer,
          slug: this.props.match.params.slug
        },
        (err, res) => {
          if (!err) {
            this.refs.savedPortal.openPortal();
            setTimeout(this.closeSavedPortal, 2000);
          }
        }
      );
    }
  }

  deleteBeer() {
    return beer => (
      <button
        className="delete"
        onClick={() => {
          deleteBeerMethod.call({ beer, slug: this.props.match.params.slug });
        }}
      />
    );
  }

  onSettingChange(event) {
    const name = event.target.name;
    let value = event.target.value;
    switch (event.target.type) {
      case 'number':
        value = parseInt(value, 10);
        break;
      default:
      case 'text':
        //no change needed
        break;
    }

    updateSetting.call(
      { name, value, slug: this.props.match.params.slug },
      (err, res) => {
        if (!err) {
          this.refs.savedPortal.openPortal();
          setTimeout(this.closeSavedPortal, 500);
        }
      }
    );
  }

  closeSavedPortal() {
    if (this.refs.savedPortal) {
      this.refs.savedPortal.closePortal();
    }
  }

  closeErrorPortal() {
    if (this.refs.errorPortal) {
      this.refs.errorPortal.closePortal();
    }
  }

  toggleShowInvite() {
    this.setState({
      showInvite: !this.state.showInvite
    });
  }

  updateInviteEmail(event) {
    this.setState({
      inviteEmail: event.target.value
    });
  }

  sendInvite() {
    const email = this.state.inviteEmail;
    sendInvite.call({
      seasonName: this.props.season.name,
      slug: this.props.match.params.slug,
      email
    });
  }

  startSeason() {
    startSeason.call({ slug: this.props.season.slug });
  }

  render() {
    if (!this.props.seasonReady) {
      return <div>Loading</div>;
    }

    return (
      <div className="container">
        {this.props.season.started ? (
          <div className="notification is-info">
            The season has started! Changes to the settings now will not persist
          </div>
        ) : (
          ''
        )}
        <div className="columns">
          <div className="column">
            <div className="box">
              <p className="title">Beers</p>
              <div className="columns">
                <div className="column">
                  <BeerSearch onChange={this.addBeer} />
                  {this.props.season.beers ? (
                    <BeerList
                      beers={this.props.season.beers}
                      right={this.deleteBeer()}
                    />
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="box">
              <p className="title">Players</p>
              <div className="columns">
                <div className="column">
                  {this.props.users ? (
                    <div className="box">
                      {this.props.users.map(user => (
                        <UserMedia user={user} key={user._id} />
                      ))}
                    </div>
                  ) : (
                    ''
                  )}
                  <div
                    className={
                      this.state.showInvite ? 'dropdown is-active' : 'dropdown'
                    }
                  >
                    <div className="dropdown-trigger">
                      <button
                        className="button is-primary"
                        onClick={this.toggleShowInvite}
                      >
                        <span className="icon">
                          <i className="fa fa-plus" />
                        </span>
                        <span>Invite player</span>
                      </button>
                    </div>
                    <div
                      className="dropdown-menu"
                      id="dropdown-menu"
                      role="menu"
                    >
                      <div className="dropdown-content">
                        <div className="dropdown-item">
                          <div className="field">
                            <p className="control has-icons-left">
                              <input
                                className="input"
                                type="email"
                                placeholder="Email"
                                onChange={this.updateInviteEmail}
                              />
                              <span className="icon is-small is-left">
                                <i className="fa fa-envelope" />
                              </span>
                            </p>
                          </div>
                          <div className="field">
                            <p className="control">
                              <button
                                className="button is-success"
                                onClick={this.sendInvite}
                              >
                                Send Invite
                              </button>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <div className="box">
              <p className="title">Starting Votes</p>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Positive</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        name="startingVote.positive"
                        value={get(
                          this.props.season.settings,
                          'startingVote.positive'
                        )}
                        onChange={this.onSettingChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Negative</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        name="startingVote.negative"
                        value={get(
                          this.props.season.settings,
                          'startingVote.negative'
                        )}
                        onChange={this.onSettingChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="title">Refresh Votes</p>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <label className="label">Positive</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        name="refreshVote.positive"
                        value={get(
                          this.props.season.settings,
                          'refreshVote.positive'
                        )}
                        onChange={this.onSettingChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="column">
                  <div className="field">
                    <label className="label">Negative</label>
                    <div className="control">
                      <input
                        className="input"
                        type="number"
                        min="0"
                        name="refreshVote.negative"
                        value={get(
                          this.props.season.settings,
                          'refreshVote.negative'
                        )}
                        onChange={this.onSettingChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="columns">
                <div className="column">
                  <div className="field">
                    <div className="control">
                      <label className="checkbox">
                        <input type="checkbox" />
                        Add refresh votes on person tie
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column is-half">
            <div className="box">
              <p className="title">Winning</p>

              <div className="field">
                <label className="label">Points to win</label>
                <div className="control">
                  <input
                    className="input"
                    type="number"
                    min="1"
                    name="pointsToVictory"
                    value={get(this.props.season.settings, 'pointsToVictory')}
                    onChange={this.onSettingChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.season.started ? (
          ''
        ) : (
          <div className="column has-text-centered">
            <a
              className="button is-success is-large is-fullwidth"
              onClick={this.startSeason}
            >
              Start Season!
            </a>
          </div>
        )}
        <Portal ref="savedPortal">
          <div
            className="notification is-primary"
            style={{ right: 50, top: 50, position: 'absolute' }}
          >
            <button className="delete" onClick={this.closeSavedPortal} />
            Saved!
          </div>
        </Portal>
        <Portal ref="errorPortal">
          <div
            className="notification is-danger"
            style={{ right: 50, top: 50, position: 'absolute' }}
          >
            <button className="delete" onClick={this.closeSavedPortal} />
            {this.state.errorMessage}
          </div>
        </Portal>
      </div>
    );
  }
}

export default withTracker(props => {
  const slug = props.match.params.slug;

  const seasonSubHandle = Meteor.subscribe('seasons.slug', slug);
  Meteor.subscribe('users.season', slug);
  const users = Meteor.users.find({ 'seasons.slug': slug }).fetch();

  return {
    seasonReady: seasonSubHandle.ready(),
    season:
      seasonSubHandle.ready() &&
      Seasons.findOne({ slug: props.match.params.slug }),
    users
  };
})(Settings);
