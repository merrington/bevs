import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './layout.html';


Template.layout.helpers({
	authInProcess: function() {
		return Meteor.loggingIn();
	},
	canShow: function() {
		return !!Meteor.user();
	},
	redirectToLogin() {
		FlowRouter.go('/login');
	}
});
