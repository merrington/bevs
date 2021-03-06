import { Seasons } from '../seasons/Seasons';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import get from 'lodash/get';
import vm from 'vm';

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
    Seasons.update(
      { slug },
      {
        $set: {
          'voting.open': true,
          'voting.votes': [],
          'voting.votedCount': 0
        }
      }
    );
  }
});

export const closeVoting = new ValidatedMethod({
  name: 'voting.close',
  validate({ slug }) {
    const season = Seasons.findOne({ slug });
    const votingOpen = get(season, 'voting.open', false);
    if (!votingOpen) {
      throw new Meteor.Error('voting-closed', 'Voting already closed');
    }
  },
  run({ slug }) {
    if (Meteor.isServer) {
      const seasonClosed = Seasons.update(
        { slug, 'voting.open': true },
        { $set: { 'voting.open': false, 'voting.votedCount': 0 } }
      );

      if (seasonClosed) {
        //update any user that didn't vote by removing 1 vote
        Meteor.users.update(
          { 'seasons.slug': slug, 'seasons.$.voted': false },
          { $inc: { 'season.$.votes.positive': -1 } },
          { multi: true }
        );

        //update all users to set voted false
        Meteor.users.update(
          { 'seasons.slug': slug },
          { $set: { 'seasons.$.voted': false } },
          { multi: true }
        );

        const season = Seasons.findOne({ slug });
        const beers = season.beers.reduce((acc, beer) => {
          acc[beer.id] = {
            beer,
            positive: 0,
            negative: 0,
            total: 0,
            highest: []
          };

          return acc;
        }, {});
        const allUserVotes = season.voting.votes;

        //add each vote to get the total positive/negative votes for each beer
        allUserVotes.forEach(userVote => {
          userVote.votes.forEach(beerVote => {
            //make sure positive and negative exist
            beerVote.positive =
              typeof beerVote.positive === 'number' ? beerVote.positive : 0;
            beerVote.negative =
              typeof beerVote.negative === 'number' ? beerVote.negative : 0;

            const beer = beers[beerVote.beer];
            beer.positive += beerVote.positive || 0;
            beer.negative += beerVote.negative || 0;

            const highestVote = beer.highest[0]; //get the current highest vote
            if (highestVote && beerVote.positive > highestVote.positive) {
              //if the current vote is greater then the highest vote then it'll be the new highest
              beer.highest = [
                {
                  user: userVote.user,
                  positive: beerVote.positive
                }
              ];
            } else if (
              highestVote &&
              beerVote.positive === highestVote.positive
            ) {
              //if the cuttent vote is the same as the highest
              beer.highest.push({
                user: userVote.user,
                positive: beerVote.positive
              });
            } else if (!highestVote && beerVote.positive > 0) {
              //no highest, use the current
              beer.highest = [
                {
                  user: userVote.user,
                  positive: beerVote.positive
                }
              ];
            }
          });
        });

        // calculate the overall totals for each beer
        for (const beerId in beers) {
          const beer = beers[beerId];

          const positiveContext = vm.createContext({
            x: beer.positive,
            positive: 0
          });
          const negativeContext = vm.createContext({
            x: beer.negative,
            negative: 0
          });
          vm.runInNewContext(
            `positive = ${season.settings.positiveValue}`,
            positiveContext
          );
          vm.runInNewContext(
            `negative = ${season.settings.negativeValue}`,
            negativeContext
          );

          const positive = positiveContext.positive;
          const negative = beer.negative ? negativeContext.negative : 0;

          beer.total = positive - negative;
        }

        //find the winning beer(s)
        let winningBeer = [];
        let pointsAwarded = 0;
        for (const beerId in beers) {
          const beer = beers[beerId];
          if (
            beer.total > 0 &&
            (!winningBeer.length || beer.total > winningBeer[0].total)
          ) {
            winningBeer = [beer];
          } else if (
            winningBeer.length &&
            beer.total === winningBeer[0].total
          ) {
            winningBeer.push(beer);
          }
        }

        //check if there's a winning beer
        if (winningBeer.length === 1) {
          if (winningBeer[0].highest.length === 1) {
            //give a victory point to this user
            const winningUserId = winningBeer[0].highest[0].user;
            Meteor.users.update(
              { _id: winningUserId, 'seasons.slug': slug },
              { $inc: { 'seasons.$.points': season.nextPoints } }
            );
            pointsAwarded = season.nextPoints;
            Seasons.update({ slug }, { $set: { nextPoints: 1 } });
          } else {
            // no point was given - increase for the next vote
            Seasons.update({ slug }, { $inc: { nextPoints: 1 } });
          }

          //give refresh points to all users
          Meteor.users.update(
            { 'seasons.slug': slug },
            {
              $inc: {
                'seasons.$.votes.positive':
                  season.settings.refreshVote.positive,
                'seasons.$.votes.negative': season.settings.refreshVote.negative
              }
            },
            { multi: true }
          );
        } else if (winningBeer.length > 1) {
          //there was a beer tie - do nothing to pointsAwarded, etc.
        } else {
          //there was no winning beer - pepsi!
        }

        const history = {
          date: new Date(),
          winningBeer,
          pointsAwarded,
          beerTotals: Object.keys(beers).map(beer => beers[beer]),
          votes: allUserVotes
        };

        //update the season
        Seasons.update({ slug }, { $addToSet: { history } });
      }
    }
  }
});

export const castVote = new ValidatedMethod({
  name: 'voting.cast',
  validate({ votes, slug, userId = undefined }) {
    if (userId && this.userId && userId !== this.userId) {
      throw new Meteor.Error('bad-user', 'Cannot cast vote for another user');
    }
    const user = Meteor.users.findOne(this.userId || userId);
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
  run({ votes, slug, comment, userId = undefined }) {
    if (!this.userId && userId) {
      this.userId = userId;
    }
    // Remove the votes cast from the user
    const userVotes = Meteor.users
      .findOne(this.userId)
      .seasons.find(season => season.slug === slug).votes;

    votes.forEach(vote => {
      userVotes.positive -= vote.positive || 0;
      userVotes.negative -= vote.negative || 0;
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
          'voting.votedCount': 1
        }
      }
    );

    return true;
  }
});
