import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layout/layout.js';

import '/imports/ui/pages/index/index.js';
import '/imports/ui/pages/group/group.js';

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render("layout", {content: 'index'});
  }
});

FlowRouter.route('/groups/:id', {
  name: 'groups.show',
  action() {
    BlazeLayout.render("layout", {content: 'group'});
  }
})
