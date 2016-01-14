Voting = {};
Voting.isValidBallot = function(votes, group, userId) {
	var totalVotes = votes.reduce(function(prev, currentVote, voteIndex, votesArray) {
		return prev + currentVote.votesFor + currentVote.votesAgainst;
	}, 0);

	if (totalVotes <= _.find(group.members, function(mbr) { return mbr.id === userId}).votes) {
		Groups.update({'_id': group._id, 'members.id': userId}, {$inc: {'members.$.votes': (0-totalVotes)}});
		return true;
	}
	return false;
}

Meteor.methods({
	startVote: function(groupId) {
		var group = Groups.findOne({'_id': groupId}), voting = {
			votes: [],
			voted: []
		}
		Groups.update(groupId, {$set: {voting: voting}});
		return true;
	},
	castVote: function(newVotes, group) {
		var self = this, voting, beerId,
			group = Groups.findOne({'_id': group._id});
		//check that user is part of the group and that they haven't voted yet
		if (Roles.userIsInRole(self.userId, ['user', 'owner'], group._id)) {
			if (!Groups.findOne({'_id': group._id, 'voting.voted': self.userId})) {
				voting = Groups.findOne().voting;
				newVotes.forEach(function (vote) {
					vote.user = self.userId
				});
				//reduce to the total number of votes this user is casting
				var allowed = Voting.isValidBallot(newVotes, group, self.userId);
				if (allowed) {
					result = Groups.update({'_id': group._id}, {$addToSet: {'voting.votes': {$each: newVotes}, 'voting.voted': self.userId}});
					if (result === 1) {
						return {
							ok: true,
							message: "Vote cast"
						}
					}
				} else {
					return {
						ok: false,
						message: "Tried to cast more votes then you have"
					}
				}
			}
			return {
				ok: false,
				message: "You already cast a vote"
			}
		}
		return {
			ok: false,
			message: "Not in the group votes cast for"
		}
	},
	closeVote: function(group) {
		var votes, beers, totals = {}, highestVote, voteTallys;

		group = Groups.findOne({'_id': group._id});
		votes = group.voting.votes;
		beers = group.beers;

		voteTallys = Meteor.call('voting/tallyVotes', group, votes);
		//check if there is a a single winning beer and add refresh points
		if (voteTallys.winner.length === 1) {
			Meteor.call('voting/addRefreshVotes', group);
			Meteor.call('voting/assignVictoryPoints', group, voteTallys.winner[0].highestVote);
		}

		newHistory = {
			date: moment().unix(),
			totals: voteTallys.totals,
			winner: voteTallys.winner,
			votes: votes
		}

		Groups.update({'_id': group._id}, {
			$unset: {voting: {}},
			$addToSet: {history: newHistory}
		});
	},
	'voting/tallyVotes': function(group, votes) {
		var totals = {};

		totals = votes.reduce(function(prev, currentVote, voteIndex, votesArr) {
			beerVotes = prev[currentVote.id] || {id: currentVote.id};
			beerVotes.totalFor = (beerVotes.totalFor || 0) + currentVote.votesFor;
			beerVotes.totalAgainst = (beerVotes.totalAgainst || 0) + currentVote.votesAgainst;
			beerVotes.total = (beerVotes.totalFor * group.points.forValue) - (beerVotes.totalAgainst * group.points.againstValue);

			// check highest
			highestVote = beerVotes.highestVote;
			//if there is no highestVote
			if (!highestVote && currentVote.votesFor) {
				beerVotes.highestVote = [currentVote];
			} else if (highestVote && (currentVote.votesFor > highestVote[0].votesFor)) {
				beerVotes.highestVote = [currentVote];
			} else if (highestVote && (currentVote.votesFor === highestVote[0].votesFor)) {
				beerVotes.highestVote.push(currentVote);
			}

			prev[currentVote.id] = beerVotes;

			return prev;
		}, {});

		totals = _.sortBy(totals, 'total').reverse();

		winner = [ totals[0] ];
		if (totals[1] && totals[1].total == winner.total) {
			winner = [
				winner,
				totals[1]
			]
		}

		return {
			winner: winner,
			totals: totals
		}
	},
	'voting/addRefreshVotes': function(group) {
		var refreshPoints = group.points.refreshPoints;
		members = group.members;
		members.forEach(function(member, idx, array) {
			array[idx].votes = array[idx].votes + refreshPoints;
		});
		Groups.update({'_id': group._id}, {$set: {'members': members}});
	},
	'voting/assignVictoryPoints': function(group, highestVote) {
		if (highestVote.length === 1) {
			Groups.update({'_id': group._id, 'members.id': highestVote[0].user}, {$inc: {'members.$.points': 1}});
		} else {
			//TODO: Implement keeping track of victory points
		}
	}
});
