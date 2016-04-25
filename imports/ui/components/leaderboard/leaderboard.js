import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import './leaderboard.html';


Template.leaderboard.onCreated(() => {
    let instance = Template.instance();
    instance.autorun(() => {
      instance.subscribe('userData');
    });
});

Template.leaderboard.helpers({
  sortedMembers() {
    let users = this.group.members;

    users.sort((user1, user2) => {
      return user1.points - user2.points;
    });

    return users.map((user) => {
      let userRecord = Meteor.users.findOne({_id: user.id});
      return Object.assign({}, user, userRecord);
    });
  }
});
