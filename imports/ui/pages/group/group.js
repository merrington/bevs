import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';

import './group.html';

import '../../components/settings/settings.js';
import '../../components/voting/voting.js';
import '../../components/leaderboard/leaderboard.js';
import '../../components/history/history.js';

Template.group.onCreated(() => {
  let instance = Template.instance();
  let groupId = FlowRouter.getParam('id');

  instance.autorun(() => {
    instance.subscribe('groups.id', groupId);
  });
});

Template.group.helpers({
  group() {
    return Groups.findOne();
  },
  isOwner() {
		return Roles.userIsInRole(Meteor.user(), ['owner'], Groups.findOne()._id);
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

Template.group.onRendered(function() {
	var voting = this.data && this.data.voting;
	if (voting) {
		if (!_.find(voting.votes, function(vote) { return vote.userId === Meteor.userId(); })) {
			//GroupView.showVoteModal();
		}
	}
});

Template.group.helpers({
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
