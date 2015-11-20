GroupView = {};

GroupView.showVoteModal = function() {
	$('#votingModal').modal({
		'observeChanges': true
	}).modal({
		onApprove: function() {
			//TODO: quick check that total # of votes < their vote count
			var votes = [], beers = Groups.findOne().beers;
			beers.forEach(function(beer) {
				votes.push({
					id: beer.id,
					votesFor: parseInt($("input[name='votesFor'][data-beer='"+beer.id+"']").val()) || 0,
					votesAgainst: parseInt($("input[name='votesAgainst'][data-beer='"+beer.id+"']").val()) || 0,
				})
			});

			var response = Meteor.call('castVote', votes, Groups.findOne());
		}
	}).modal('show');
}


Template.group.events({
	'click #startVote': function(event) {
		Meteor.call('startVote', Groups.findOne(), function(error, result) {
			if (error) {
				console.log(error);
			} else {
				GroupView.showVoteModal();
			}
		});
	},
	'click #castVote': function(event) {
		GroupView.showVoteModal();
	},
	'click #closeVote': function(event) {
		Meteor.call('closeVote', Groups.findOne());
	},
	'click #groupSettingsButton': function(event) {
		$('#groupSettingsModal').modal({'observeChanges': true})
		.modal({
			onApprove: function() {
				var newSettings = {
					'points': {
						'starterPoints': parseInt($('#starterPoints').val()),
						'refreshPoints': parseInt($('#refreshPoints').val()),
						'seasonWinPoints': parseInt($('#seasonWinPoints').val()),
						'forValue': parseFloat($('#forValue').val()),
						'againstValue': parseFloat($('#againstValue').val()),
						'loserVpBonus': parseFloat($('#loserVpBonus').val()),
					}
				}
				Meteor.call('updateGroupSettings', Groups.findOne()._id, newSettings);
			}
		}).modal('show');
	}
});

Template.group.onRendered(function() {
	var voting = this.data && this.data.voting;
	if (voting) {
		if (!_.find(voting.votes, function(vote) { return vote.userId === Meteor.userId(); })) {
			//GroupView.showVoteModal();
		}
	}
});

Template.group.helpers({
	isOwner: function() {
		return Roles.userIsInRole(Meteor.user(), ['owner'], this._id);
	},
	hasVoted: function() {
		return Groups.findOne({'voting.voted': Meteor.userId()});
	},
	votesCounted: function() {
		return Groups.findOne().voting.voted.length + "/" + Groups.findOne().members.length;
	},
	majorityDisabled: function() {
		if ((Groups.findOne().voting.voted.length / Groups.findOne().members.length) > 0.5) {
			return;
		}
		return 'disabled';
	}
});

Template.history.helpers({
	history: function() {
		if (this.history) {
			return this.history.sort(function(vote1, vote2) {
				return vote2.date - vote1.date;
			});
		}
	},
	winningBeer: function(totals) {
		var self = this;
		return _.find(Groups.findOne().beers, function(beer) {
			return beer.id === totals[0].id;
		});
	},
	votes: function(totals) {
		var self = this;
		return _.find(totals, function(total) {
			return self.beer.id === total.id;
		}).total;
	},
	beerTotals: function(beers, totals) {
		beers.forEach(function (beer) {
			beer.total = _.find(totals, function(total) {
				return total.id == beer.id;
			}).total;
		});

		return beers.sort(function(beer1, beer2) {
			return beer2.total - beer1.total;
		});
	},
	total: function(totals) {
		var beer = this.beer;
		return _.find(totals, function(total) {
			return total.id === beer.id;
		}).total;
	}
});