import { Groups } from './groups.js';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

import moment from 'moment';

export const newGroup = new ValidatedMethod({
  name: 'groups.new',
  validate: null,
  run({name}) {
    if (Meteor.isServer) {
      let groupId = Groups.insert({name, ownerId: this.userId}, (error, id) => {
        if (error) {
          throw "Error creating";
        } else {
          Roles.addUsersToRoles(this.userId, ['owner'], id);
        }
      });
      return groupId;
    }
  }
});

export const updateGroupSettings = new ValidatedMethod({
  name: 'groups.updateSettings',
  validate({groupId}) {
    const errors = [];

    let user = Meteor.users.findOne({'_id': this.userId});
    if (!Roles.userIsInRole(user, ['owner'], groupId)) {
      errors.push({name: 'user', type: 'Not an owner'});
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  },
  run({groupId, settings}) {
    let group = Groups.findOne({'_id': groupId});
    let user = Meteor.users.findOne({'_id': this.userId});
    group = Object.assign({}, group, settings);
    Groups.update({'_id': groupId}, group);
  }
});

export const startVote = new ValidatedMethod({
  name: 'groups.startVote',
  validate: null,
  run({groupId}) {
    let group = Groups.findOne({'_id': groupId}), voting = {
      votes: [],
      voted: []
    }
    Groups.update(groupId, {$set: {voting: voting}});
    return true;
  }
});

export const castVote = new ValidatedMethod({
  name: 'groups.castVote',
  validate({vote, groupId}) {
    const errors = [];

    let group = Groups.findOne({_id: groupId});
    let user = group.members.find((user) => {
      return user.id === this.userId;
    });

    //check user is in the group
		if (!Roles.userIsInRole(this.userId, ['user', 'owner'], groupId)) {
      errors.push({name: 'user', type: 'Not part of the group'});
    }

    //check user hasn't already voted
    if (Groups.findOne({'_id': groupId, 'voting.voted': this.userId})) {
      errors.push({name: 'vote', type: 'Already voted'});
    }

    //check user is casting at least 1 positive vote
    let pv = Object.keys(vote.positiveVotes).reduce((prev, curr) => {
      curr = vote.positiveVotes[curr];
      return prev + curr;
    }, 0);
    if (pv < 1) {
      errors.push({name: 'vote', type: 'No positive vote made'});
    }

    //check user has enough votes
    let nv = Object.keys(vote.negativeVotes).reduce((prev, curr) => {
      curr = vote.negativeVotes[curr];
      return prev + curr;
    }, 0);
    if (nv > user.negativeVotes) {
      errors.push({name: 'vote', type: 'Placing more negative votes then available'});
    }
    if (pv > user.positiveVotes) {
      errors.push({name: 'vote', type: 'Placing more positive votes then available'});
    }

    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  },
  run({vote, groupId}) {
    let self = this;
    let group = Groups.findOne({_id: groupId});
    let votes = group.voting.votes;

    /*
    vote = {
      positiveVotes: {beer1: 1, beer2: 1},
      negativeVotes: {beer3: 1, beer4: 1},
    }
    */
    let pvc = 0, nvc = 0;
    let pv = Object.keys(vote.positiveVotes).map((beerId) => {
      pvc += vote.positiveVotes[beerId];
      return {
        beer: beerId,
        user: self.userId,
        positiveVotes: vote.positiveVotes[beerId]
      }
    });
    let nv = Object.keys(vote.negativeVotes).map((beerId) => {
      nvc += vote.negativeVotes[beerId];
      return {
        beer: beerId,
        user: self.userId,
        negativeVotes: vote.negativeVotes[beerId]
      }
    });
    let av = pv.concat(nv);

    Groups.update({_id: groupId}, {
      $addToSet: {'voting.voted': self.userId, 'voting.votes': {$each: av}}
    });
    Groups.update({_id: groupId, 'members.id': self.userId}, {
      $inc: {'members.$.positiveVotes': (0-pvc), 'members.$.negativeVotes': (0-nvc)}
    });
  }
});

export const closeVote = new ValidatedMethod({
  name: 'groups.closeVote',
  validate: null,
  run({groupId}) {
    function tallyVotes({group, votes}) {
      let voteTally = {};
      group.beers.forEach((beer) => {
        voteTally[beer.id] = {
          beer: beer.id,
          name: beer.name,
          image: beer.image,
          positiveVotes: 0,
          negativeVotes: 0,
          total: 0,
          highestVotes: []
        }
      });

      votes.forEach((vote) => {
        voteTally[vote.beer].positiveVotes += (vote.positiveVotes || 0);
        voteTally[vote.beer].negativeVotes += (vote.negativeVotes || 0);

        //calculate the total
        let positiveTotal = 0, negativeTotal = 0;
        positiveTotal = eval(group.points.positiveValue.replace('x', voteTally[vote.beer].positiveVotes));
        negativeTotal = eval(group.points.negativeValue.replace('x', voteTally[vote.beer].negativeVotes));
        voteTally[vote.beer].total = positiveTotal - negativeTotal;

        if (voteTally[vote.beer].highestVotes.length === 0 || vote.positiveVotes === voteTally[vote.beer].highestVotes[0].votes) {
          voteTally[vote.beer].highestVotes.push({
            votes: vote.positiveVotes,
            user: vote.user
          });
        } else if (voteTally[vote.beer].highestVotes.length > 0 && vote.positiveVotes > voteTally[vote.beer].highestVotes[0].votes) {
          voteTally[vote.beer].highestVotes = [{
            votes: vote.positiveVotes,
            user: vote.user
          }];
        }
      });

      voteTally = Object.keys(voteTally).sort((beer1, beer2) => {
        return voteTally[beer2].total - voteTally[beer1].total;
      }).map((beerId) => {
        return voteTally[beerId];
      });

      return voteTally;
    }

    function addRefreshVotes({group}) {
      group.members.forEach((user) => {
        let refreshPositiveVotes = group.points.refreshPositiveVotes, refreshNegativeVotes = group.points.refreshNegativeVotes;
        if (group.voting.voted.indexOf(user.id) === -1) {
          refreshPositiveVotes -= 1;
        }
        Groups.update({_id: group._id, 'members.id': user.id}, {
          $inc: {
            'members.$.positiveVotes': refreshPositiveVotes,
            'members.$.negativeVotes': refreshNegativeVotes
          }});
      });
    }

    function addVictoryPoints({group, voteTally}) {
      let users = voteTally[0].highestVotes.map((vote) => {
        return vote.user;
      });
      if (users.length === 1) {
        Groups.update({_id: group._id, 'members.id': users[0]}, {$inc: {'members.$.points': group.victoryPointBank}, $set: {victoryPointBank: 1}});
      } else {
        Groups.update({_id: group._id}, {$inc: {victoryPointBank: 1}});
      }
      return users;
    }


    /*
    Start doing the processing
    */
    let group = Groups.findOne({_id: groupId});
    let votes = group.voting.votes;

    //taly the votes
    let voteTally = tallyVotes({group, votes});
    let newHistory = {
      date: moment().toDate(),
      votes: voteTally
    };
    //check if there's a single winning beer
    let swb = voteTally[0].total !== voteTally[1].total;
    if (swb) {
      addRefreshVotes({group});
      newHistory.winningBeer = voteTally[0];
      newHistory.winningUser = addVictoryPoints({group, voteTally});
    }

    Groups.update({_id: group._id}, {$unset: {voting: {}}, $addToSet: {history: newHistory}});
  }
});
