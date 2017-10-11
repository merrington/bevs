import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { openVoting, closeVoting, castVote } from '/imports/api/voting/methods';
import { Seasons } from '/imports/api/seasons/Seasons';
import VoteHistory from '../../components/voteHistory/VoteHistory';
import BeerList from '../../components/beerList/BeerList';
import get from 'lodash/get';
import isEqual from 'lodash/isequal';

class Voting extends React.Component {
  constructor(props) {
    super(props);

    const startingVotes = get(
      props.season,
      'beers',
      []
    ).reduce((beerMap, beer) => {
      beerMap[beer.id] = {
        positive: 0,
        negative: 0
      };
      return beerMap;
    }, {});

    this.state = {
      ...startingVotes,
      ...props.votes,
      showLastHistory: false
    };

    this.openVoting = this.openVoting.bind(this);
    this.votingControls = this.votingControls.bind(this);
    this.increaseVote = this.increaseVote.bind(this);
    this.decreaseVote = this.decreaseVote.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.castVote = this.castVote.bind(this);
    this.voteIsCast = this.voteIsCast.bind(this);
    this.closeVoting = this.closeVoting.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    //check for `votes` being updated - can happen if there's a revote
    if (!isEqual(nextProps.votes, this.props.votes)) {
      this.setState({
        ...nextProps.votes
      });
    }

    if (!isEqual(nextProps.season.history, this.props.season.history)) {
      this.setState({
        showLastHistory: true
      });
    }
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

  updateComment(event) {
    this.setState({
      comment: event.target.value
    });
  }

  castVote() {
    const votes = this.props.season.beers.map(beer => ({
      beer: beer.id,
      ...this.state[beer.id]
    }));

    castVote.call({
      slug: this.props.season.slug,
      votes,
      comment: this.state.comment
    });
  }

  voteIsCast() {
    return this.props.voted;
  }

  closeVoting() {
    closeVoting.call({ slug: this.props.season.slug });
  }

  render() {
    if (get(this.props.season, 'voting.open')) {
      if (this.voteIsCast()) {
        const players = Meteor.users
          .find({
            'seasons.slug': this.props.season.slug
          })
          .count();

        const playersLeftToVote = players - this.props.season.voting.votedCount;
        const votedRatio = this.props.season.voting.votedCount / players;

        return (
          <div className="hero">
            <div className="hero-body">
              <div className="columns is-centered">
                <div className="column is-half has-text-centered">
                  <div>
                    <progress
                      className="progress is-primary"
                      value={this.props.season.voting.votedCount}
                      max={players}
                    />
                  </div>
                  <div>
                    Waiting for {playersLeftToVote}{' '}
                    {playersLeftToVote && playersLeftToVote >= 1
                      ? 'players'
                      : 'player'}{' '}
                    to vote
                  </div>
                  <div>
                    {votedRatio && (
                      <a
                        className="button is-primary is-large"
                        onClick={this.closeVoting}
                      >
                        <span className="icon is-small">
                          <i className="fa fa-check" />
                        </span>
                        <span>Close Vote!</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
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
                      <p className="subtitle">
                        This is for{' '}
                        <span className="has-text-primary">
                          {this.props.season.nextPoints}
                        </span>{' '}
                        points
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
                          onChange={this.updateComment}
                        />
                      </div>
                    </div>

                    <a
                      className="button is-success is-large is-pulled-right"
                      onClick={this.castVote}
                    >
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
              {this.state.showLastHistory && (
                <div className="columns is-centered">
                  <div className="column is-one-third-desktop is-half-mobile">
                    <VoteHistory
                      {...this.props.season.history[
                        this.props.season.history.length - 1
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withTracker(props => {
  const userSeasons = get(Meteor.user(), 'seasons', []);
  const userSeason = userSeasons.find(
    season => season.slug === props.season.slug
  );
  const userVotes = userSeason.votes;

  return {
    ...props,
    voted: userSeason.voted,
    votes: userVotes
  };
})(Voting);

//TODO - handle double click - set buttons as disabled after clicking
