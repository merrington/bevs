import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { openVoting, closeVoting } from '/imports/api/voting/methods';
import BeerList from '../../components/beerList/BeerList';
import get from 'lodash/get';

class Voting extends React.Component {
  constructor(props) {
    super(props);

    const startingVotes = props.season.beers.reduce((beerMap, beer) => {
      beerMap[beer.id] = {
        positive: 0,
        negative: 0
      };
      return beerMap;
    }, {});

    this.state = {
      positive: 10,
      negative: 3,
      ...startingVotes
    };

    this.openVoting = this.openVoting.bind(this);
    this.votingControls = this.votingControls.bind(this);
    this.increaseVote = this.increaseVote.bind(this);
    this.decreaseVote = this.decreaseVote.bind(this);
  }

  openVoting() {
    openVoting.call({ slug: this.props.season.slug });
  }

  increaseVote(event) {
    const beer = event.target.dataset.beer;
    const pn = event.target.dataset.pn;
    const hasVote = this.state[pn] > 0;

    if (hasVote) {
      this.setState({
        [beer]: { ...this.state[beer], [pn]: this.state[beer][pn] + 1 },
        [pn]: this.state[pn] - 1
      });
    }
  }

  decreaseVote(event) {
    const beer = event.target.dataset.beer;
    const pn = event.target.dataset.pn;
    const beerHasVote = this.state[beer][pn] > 0;

    if (beerHasVote) {
      this.setState({
        [beer]: { ...this.state[beer], [pn]: this.state[beer][pn] - 1 },
        [pn]: this.state[pn] + 1
      });
    }
  }

  setVote(event) {
    const beer = event.target.dataset.beer;
    const pn = event.target.dataset.pn;
  }

  votingControls() {
    return beer => {
      const beerId = beer.id;
      return (
        <span>
          <div className="field has-addons">
            <p className="control">
              <a
                className="button is-success"
                data-beer={beerId}
                data-pn="positive"
                onClick={this.increaseVote}
              >
                +
              </a>
            </p>
            <p className="control">
              <input
                type="number"
                className="input is-success"
                placeholder="Positive"
                min="0"
                value={
                  this.state[beerId].positive ? this.state[beerId].positive : ''
                }
              />
            </p>
            <p className="control">
              <a
                className="button is-success"
                data-beer={beerId}
                data-pn="positive"
                onClick={this.decreaseVote}
              >
                -
              </a>
            </p>
          </div>
          <div className="field has-addons">
            <p className="control">
              <a
                className="button is-danger"
                data-beer={beerId}
                data-pn="negative"
                onClick={this.increaseVote}
              >
                +
              </a>
            </p>
            <p className="control">
              <input
                type="number"
                className="input is-danger"
                placeholder="Negative"
                min="0"
                value={
                  this.state[beerId].negative ? this.state[beerId].negative : ''
                }
              />
            </p>
            <p className="control">
              <a
                className="button is-danger"
                data-beer={beerId}
                data-pn="negative"
                onClick={this.decreaseVote}
              >
                -
              </a>
            </p>
          </div>
        </span>
      );
    };
  }

  render() {
    if (get(this.props.season, 'voting.open')) {
      return (
        <div className="container">
          <div className="hero">
            <div className="hero-body">
              <div className="columns is-centered is-mobile">
                <div className="column is-two-thirds-desktop is-half-tablet">
                  <div className="box is-clearfix">
                    <div className="notification">
                      <p className="title is-5">
                        You have{' '}
                        <span className="has-text-success">
                          {this.state.positive} positive votes
                        </span>{' '}
                        and{' '}
                        <span className="has-text-danger">
                          {this.state.negative} negative votes
                        </span>
                      </p>
                    </div>

                    <BeerList
                      beers={this.props.season.beers}
                      right={this.votingControls()}
                    />

                    <div className="field">
                      <div className="control">
                        <textarea
                          className="textarea"
                          placeholder="What was the plan? Who backstabbed who? Share secrets or just talk trash here. This will be shown when the season is finished"
                        />
                      </div>
                    </div>

                    <a className="button is-success is-large is-pulled-right">
                      Cast Vote
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container">
          <div className="hero">
            <div className="hero-body">
              <div className="columns is-centered">
                <div className="column is-half has-text-centered">
                  <a
                    className="button is-primary is-large"
                    onClick={this.openVoting}
                  >
                    Open Voting
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withTracker(() => {
  return {};
})(Voting);
