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
		var self = this, voting, beerId;
		//check that user is part of the group and that they haven't voted yet
		if (Roles.userIsInRole(self.userId, ['user', 'owner'], group._id)) {
			if (!Groups.findOne({'_id': group._id, 'voting.voted': self.userId})) {
				voting = Groups.findOne().voting;
				newVotes.forEach(function (vote) {
					vote.user = self.userId
				});
				result = Groups.update({'_id': group._id}, {$addToSet: {'voting.votes': {$each: newVotes}, 'voting.voted': self.userId}});
				if (result === 1) {
					return {
						ok: true,
						message: "Vote cast"
					}
				}
			}
			return {
				ok: false,
				message: "Already cast a vote"
			}
		}
		return {
			ok: false,
			message: "Not in the group votes cast for"
		}
	},
	closeVote: function(group) {
		var votes, beers, totals = [];
		group = Groups.findOne({'_id': group._id});
		votes = group.voting.votes;
		beers = group.beers;


		beers.forEach(function(beer) {
			totals.push(
				votes.map(function(vote, idx, arr) {
					if (vote.id === this.id) {
						return {
							id: vote.id,
							user: vote.user,
							total: (vote.votesFor * group.points.forValue) - (vote.votesAgainst * group.points.againstValue)
						}
					} else {
						return {
							id: this.id,
							total: 0
						}
					}
				}, beer)
				.reduce(function(prev, curr, idx, arr) {//TODO: determine who has the highest vote
					if (!curr) {
						curr = {
							id: prev.id,
							total: prev.total 
						}
					} 
					if (!prev) {
						prev = {
							id: curr.id,
							total: 0
						}
					}
					console.log(prev, curr);
					return {
						id: curr.id,
						total: prev.total + curr.total
					}
				})
			);
		});
		console.log(totals);
		totals.sort(function(beer1, beer2) {
			return beer2.total - beer1.total;
		});
		var winner = totals[0];
		console.log('winner', winner);
		newHistory = {
			date: moment().unix(),
			totals: totals
		}

		Groups.update({'_id': group._id}, {
			$unset: {voting: {}}, 
			$addToSet: {history: newHistory}
		});
	}
	/*
	castVote: function(newVotes, group) {
		var self = this, voting, beerId;
		//check that user is part of the group and that they haven't voted yet
		if (Roles.userIsInRole(self.userId, ['user', 'owner'], group._id)) {
			if (!Groups.findOne({'_id': group._id, 'voting.voted': self.userId})) {
				voting = Groups.findOne().voting;
				voting.votes = voting.votes || {};
				newVotes.forEach(function(vote) {
					beerId = vote.id;
					voting.votes[beerId] = voting.votes[beerId] || { who: [] };
					voting.votes[beerId] = {
						votesFor: (voting.votes[beerId].votesFor || 0) + vote.votesFor,
						votesAgainst: (voting.votes[beerId].votesAgainst || 0) + vote.votesAgainst,
						who: voting.votes[beerId].who
					}
					voting.votes[beerId].who.push({'_id': self.userId, 'votesFor': vote.votesFor});
				});
				if (!voting.voted) {
					voting.voted = [];
				}
				voting.voted.push(self.userId);

				result = Groups.update({'_id': group._id}, {$set: {voting: voting}});
				if (result === 1) {
					return {
						ok: true,
						message: "Vote cast"
					}
				}
			}
			return {
				ok: false,
				message: "Already cast a vote"
			}
		}
		return {
			ok: false,
			message: "Not in the group votes cast for"
		}
	},
	closeVote: function(group) {
		var votes, total;
		group = Groups.findOne({'_id': group._id});
		votes = group.voting.votes;

		console.log(_.toArray(votes));
		//do some math!
		_.each(votes, function(beer) {
			beer.total = (beer.votesFor * group.points.forValue) - (beer.votesAgainst * group.points.againstValue)
		});
		console.log(votes);
		//sort by highest total
		var sorted = _.sortBy(votes, function(beer) { return beer.total });
		sorted.reverse();
		console.log(sorted);
		console.log("winner", winner);
	}*/
});