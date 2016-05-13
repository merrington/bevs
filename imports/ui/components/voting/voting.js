import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';
import { startVote, closeVote } from '/imports/api/groups/methods.js';

import './voting.html';

import './votingModal/votingModal.js';

Template.voting.onRendered(() => {
	let instance = Template.instance();
	let oldHistoryLength = Groups.findOne().history.length;
	instance.autorun(() => {
		Groups.find({_id: instance.data.group._id}).observeChanges({
			changed(id, fields) {
				if (fields.history && fields.history.length > oldHistoryLength) {
					//get the last item in the history and show the history panel for it
					let result = fields.history[fields.history.length-1];
					Blaze.renderWithData(Template.historyDetails, {history: result}, $('#resultDiv')[0]);
					$('#resultDiv').addClass('animated tada')
					oldHistoryLength = fields.history.length;
				}
			}
		});
	})
});

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
	},
	votingDisabled() {
		if (Meteor.settings.public && Meteor.settings.public.dev) {
			return false;
		}
		let memberCount = Groups.findOne().members.length;
		let votedCount = Groups.findOne().voting.voted.length;
		return (votedCount / memberCount) < 0.5;
	}
})
