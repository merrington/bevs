import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Groups } from '/imports/api/groups/groups.js';

import './layout.html';

Template.layout.onRendered(() => {
	let instance = Template.instance();
	instance.autorun(() => {
		if (FlowRouter.getParam('id')) {
			instance.subscribe('groups.id', FlowRouter.getParam('id'));
			instance.data.groupId = FlowRouter.getParam('id');
		}
	});

	instance.autorun(() => {
		let name = FlowRouter.getRouteName();
		let selector = `.nav li[data-route='${name}']`;
		console.log('Route name', selector, $(selector));
		$('.nav li[class="active"]').removeClass('active');
		$(selector).addClass('active');
	});
})

Template.layout.helpers({
	inGroup() {
		return Meteor.user() && FlowRouter.getParam('id') && Template.instance().subscriptionsReady();
	},
	positiveVotes() {
		return Groups.findOne().members.find((user) => {return user.id === Meteor.userId()}).positiveVotes;
	},
	negativeVotes() {
		return Groups.findOne().members.find((user) => {return user.id === Meteor.userId()}).negativeVotes;
	},
	authInProcess: function() {
		return Meteor.loggingIn();
	},
	canShow: function() {
		return !!Meteor.user();
	},
	redirectToLogin() {
		FlowRouter.go('/login');
	},
	isOwner(groupId) {
		return Roles.userIsInRole(Meteor.user(), ['owner'], groupId);
	},
	group(groupId) {
		return Groups.findOne(groupId)
	}
});
