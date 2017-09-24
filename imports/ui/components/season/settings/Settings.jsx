import React from 'react';
import BeerList from '../../beerList/BeerList';
import BeerSearch from './BeerSearch';
import get from 'lodash/get';
import {
  addBeer as addBeerMethod,
  deleteBeer as deleteBeerMethod,
  updateSetting
} from '/imports/api/seasons/methods';
import { Seasons } from '/imports/api/seasons/Seasons';
import { withTracker } from 'meteor/react-meteor-data';
import Portal from 'react-portal';

class Settings extends React.Component {
  constructor(props) {
    super(props);

    this.addBeer = this.addBeer.bind(this);
    this.onSettingChange = this.onSettingChange.bind(this);
    this.closeSavedPortal = this.closeSavedPortal.bind(this);
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
            setTimeout(this.closeSavedPortal, 1000);
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

  render() {
    if (!this.props.seasonReady) {
      return <div>Loading</div>;
    }

    return (
      <div className="container">
        <div className="columns">
          <div className="column">
            <div className="box">
              <p className="title">Beers</p>
              <div className="columns">
                <div className="column">
                  <BeerSearch onChange={this.addBeer} />
                  <BeerList
                    beers={this.props.season.beers}
                    right={this.deleteBeer()}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="column">
            <div className="box">
              <p className="title">Users</p>
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
                        name="startingVote.positive"
                        type="number"
                        min="0"
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
                    value={this.props.season.settings.pointsToVictory}
                    onChange={this.onSettingChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Portal ref="savedPortal">
          <div
            className="notification is-primary"
            style={{ right: 50, top: 50, position: 'absolute' }}
          >
            <button className="delete" onClick={this.closeSavedPortal} />
            Saved!
          </div>
        </Portal>
      </div>
    );
  }
}

export default withTracker(props => {
  const seasonSubHandle = Meteor.subscribe(
    'season.slug',
    props.match.params.slug
  );

  return {
    seasonReady: seasonSubHandle.ready(),
    season:
      seasonSubHandle.ready() &&
      Seasons.findOne({ slug: props.match.params.slug })
  };
})(Settings);
