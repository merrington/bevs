import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating'

import { Groups } from '/imports/api/groups/groups.js';

import './vote.html';

import '../../components/voting/voting.js';

Template.vote.onCreated(() => {
  let instance = Template.instance();
  instance.autorun(() => {
    instance.subscribe('groups.id', FlowRouter.getParam('id'));
  });
});

Template.vote.helpers({
  group() {
    return Groups.findOne();
  }
})
