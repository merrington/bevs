import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('users.season', slug => {
  return Roles.getUsersInRole(['owner', 'player'], slug);
});
