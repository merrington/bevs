import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import moment from 'moment';

import './history.html';

Template.historyDetails.helpers({
	date(date) {
		return new moment(date).format('MMM Do, YYYY @ hh:mma')
	},
	singleWinner(users) {
		return users.length === 1;
	},
	winner(user) {
		return Meteor.users.findOne({_id: user[0]}).profile.name;
	}
});
