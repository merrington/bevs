import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Groups } from '/imports/api/groups/groups.js';

import './history.html';

import '../../components/historyDetails/historyDetails.js';

Template.history.onCreated(() => {
  let instance = Template.instance();
  instance.autorun(() => {
    instance.subscribe('groups.id', FlowRouter.getParam('id'));
    instance.data.group = Groups.findOne();
  })
});

Template.history.helpers({
});
