import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';
import { startVote, closeVote } from '/imports/api/groups/methods.js';

import './voting.html';

import './votingModal/votingModal.js';

Template.voting.events({
	'click #startVote'(event) {
    let instance = Template.instance();
		startVote.call({groupId: instance.data.group._id}, function(error, result) {
			if (error) {
				console.log(error);
			}
		});
	},
	'click #closeVote': function(event) {
		let instance = Template.instance();
		closeVote.call({groupId: instance.data.group._id});
	}
});

Template.voting.helpers({
  hasVoted() {
    return Groups.findOne({'voting.voted': Meteor.userId()});
  }
});

Template.votedMessage.helpers({
	progress() {
		let memberCount = Groups.findOne().members.length;
		let votedCount = Groups.findOne().voting.voted.length;
		return (votedCount / memberCount) * 100;
	}
})
