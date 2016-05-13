import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';

import moment from 'moment';

import './historyDetails.html';

Template.historyDetails.onCreated(() => {
	let instance = Template.instance();
	instance.autorun(() => {
		let groupId = FlowRouter.getParam('id');
		instance.subscribe('userData', groupId);
	})
})

Template.historyDetails.helpers({
	date(date) {
		return new moment(date).format('MMM Do, YYYY @ hh:mma')
	},
	singleWinner(users) {
		if (users) {
			return users.length === 1;
		}
	},
	winner(user) {
		return Meteor.users.findOne({_id: user[0]}).profile.name;
	}
});
