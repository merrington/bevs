import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';
import { startVote } from '/imports/api/groups/methods.js';

import './voting.html';

import './votingModal/votingModal.js';

Template.voting.events({
	'click #startVote': (event) => {
    let instance = Template.instance();
		startVote.call({groupId: instance.data.group._id}, function(error, result) {
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

Template.voting.helpers({
  hasVoted: () => {
    return Groups.findOne({'voting.voted': Meteor.userId()});
  }
});
