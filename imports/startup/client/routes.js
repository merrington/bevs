import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layout/layout.js';

import '/imports/ui/pages/index/index.js';
import '/imports/ui/pages/group/group.js';
import '/imports/ui/pages/vote/vote.js';
import '/imports/ui/pages/history/history.js';
import '/imports/ui/pages/leaderboard/leaderboard.js';

FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render("layout", {content: 'index'});
  }
});

let groupRoutes = FlowRouter.group({
  prefix: '/groups/:id',
  name: 'groups'
});

groupRoutes.route('/', {
  triggersEnter: [function(context, redirect) {
    console.log(context);
    redirect(`${context.path}/voting`);
  }]
});

groupRoutes.route('/voting', {
  name: 'voting',
  action() {
    BlazeLayout.render("layout", {content: 'vote'});
  }
});

groupRoutes.route('/history', {
  name: 'history',
  action() {
    BlazeLayout.render("layout", {content: 'history'});
  }
});

groupRoutes.route('/leaderboard', {
  name: 'leaderboard',
  action() {
    BlazeLayout.render("layout", {content: 'leaderboard'});
  }
});
//FlowRouter.route('/groups/:id', {
//  name: 'groups.show',
//  action() {
//    BlazeLayout.render("layout", {content: 'group'});
//  }
//})
