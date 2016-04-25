import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';

import './group.html';

import '../../components/history/history.js';
import '../../components/leaderboard/leaderboard.js';

Template.group.onCreated(() => {
  let instance = Template.instance();

  instance.autorun(() => {
    instance.subscribe('groups');
  });
});

Template.group.helpers({
  group() {
    let groupId = FlowRouter.getParam('id');
    return Groups.findOne({_id: groupId});
  }
});

GroupView = {};

GroupView.showVoteModal = function() {
	$('#votingModal').modal({
		'observeChanges': true
	}).modal({
		onApprove: function() {
			// set the loading status on the button
			$('#votingButtonLoader').addClass('active').removeClass('disabled');
			$('#votingButton').addClass('disabled');

			var votes = [], beers = Groups.findOne().beers;
			beers.forEach(function(beer) {
				votes.push({
					id: beer.id,
					votesFor: parseInt($("input[name='votesFor'][data-beer='"+beer.id+"']").val()) || 0,
					votesAgainst: parseInt($("input[name='votesAgainst'][data-beer='"+beer.id+"']").val()) || 0,
				})
			});

			Meteor.call('castVote', votes, Groups.findOne(), function(error, result) {
				if (result.ok) {
					$('#votingModal').modal('hide');
					$('#votingModalErrorMessage').addClass('hidden');
				} else {
					$('#votingModalErrorMessage').removeClass('hidden');
					Session.set('votingErrorMessage', result.message);
				}
				$('#votingButtonLoader').removeClass('active').addClass('disabled');
				$('#votingButton').removeClass('disabled');
			});

			return false;
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
		var group = this;
		return group.voting.voted.length + "/" + group.members.length;
	},
	majorityDisabled: function() {
		var group = this;
		if (group.voting && (group.voting.voted.length / group.members.length) > 0.5) {
			return;
		}
		return 'disabled';
	}
});
