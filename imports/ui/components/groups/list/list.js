import { Template } from 'meteor/templating';

import { Groups } from '/imports/api/groups/groups.js';

import './list.html';

Template.list.onCreated(() => {
  let instance = Template.instance();
  instance.autorun(() => {
    instance.subscribe('groups.user');
  });
});

Template.list.helpers({
  'groups': function() {
    console.log(Groups.find().fetch());
    return Groups.find({}, {order: {name: 1}});
  },
	'points': function(group) {
    return group.members.find((user) => {
      return user.id === Meteor.userId();
    }).points;
	}
})