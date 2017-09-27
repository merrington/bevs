import { Seasons } from '../seasons/Seasons';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import get from 'lodash/get';

export const openVoting = new ValidatedMethod({
  name: 'voting.open',
  validate({ slug }) {
    const season = Seasons.findOne({ slug });
    const votingOpen = get(season, 'voting.open', false);
    if (votingOpen) {
      throw new Meteor.Error('voting-open', 'Voting already open');
    }
  },
  run({ slug }) {
    Seasons.update({ slug }, { $set: { 'voting.open': true } });
  }
});

export const closeVoting = new ValidatedMethod({
  name: 'voting.close',
  validate({ slug }) {
    const votingOpen = get(season, 'voting.open', false);
    if (!votingOpen) {
      throw new Meteor.Error('voting-closed', 'Voting already closed');
    }
  },
  run({ slug }) {
    Seasons.update({ slug }, { $set: { 'voting.open': false } });
  }
});

export const castVote = new ValidatedMethod({
  name: 'voting.cast',
  validate({ votes, slug }) {
    const user = Meteor.users.findOne(this.userId);
    const userSeason = get(user, 'seasons', []).find(
      season => season.slug === slug
    );

    const userVotes = userSeason.votes;
    const votesCast = votes.reduce((acc, vote) => {
      return {
        positive: acc.positive + vote.positive,
        negative: acc.negative + vote.negative
      };
    });

    if (
      votesCast.positive > userVotes.positive ||
      votesCast.negative > userVotes.negative
    ) {
      throw new Meteor.Error(
        'not-enough-votes',
        'Tried to cast more votes then available'
      );
    }

    //user hasn't voted previously
    if (userSeason.voted) {
      throw new Meteor.Error('already-voted', 'Already cast a vote');
    }
  },
  run({ votes, slug, comment }) {
    // Remove the votes cast from the user
    const userVotes = Meteor.users
      .findOne(this.userId)
      .seasons.find(season => season.slug === slug).votes;

    votes.forEach(vote => {
      userVotes.positive -= vote.positive;
      userVotes.negative -= vote.negative;
    });

    Meteor.users.update(
      { _id: this.userId, 'seasons.slug': slug },
      {
        $set: { 'seasons.$.votes': userVotes, 'seasons.$.voted': true }
      }
    );

    //add the votes to the history of voting
    Seasons.update(
      { slug },
      {
        $addToSet: {
          'voting.votes': {
            user: this.userId,
            votes,
            comment
          }
        },
        $inc: {
          'voting.voted.count': 1
        }
      }
    );
  }
});
