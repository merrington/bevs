import { Groups } from './groups.js';

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';

export const newGroup = new ValidatedMethod({
  name: 'groups.new',
  validate: null,
  run({name}) {
    if (Meteor.isServer) {
      let groupId = Groups.insert({name, ownerId: this.userId}, (error, id) => {
        if (error) {
          throw "Error creating";
        } else {
          Roles.addUsersToRoles(this.userId, ['owner'], id);
        }
      });
      return groupId;
    }
  }
});

export const updateGroupSettings = new ValidatedMethod({
  name: 'groups.updateSettings',
  validate: null,
  run({groupId, settings}) {
    let group = Groups.findOne({'_id': groupId});
    let user = Meteor.users.findOne({'_id': this.userId});
    if (Roles.userIsInRole(user, ['owner'], groupId)) {
      group = Object.assign({}, group, settings);
      Groups.update({'_id': groupId}, group);
    }
  }
});

export const startVote = new ValidatedMethod({
  name: 'groups.startVote',
  validate: null,
  run({groupId}) {
    let group = Groups.findOne({'_id': groupId}), voting = {
      votes: [],
      voted: []
    }
    Groups.update(groupId, {$set: {voting: voting}});
    return true;
  }
})




//Meteor.methods({
//	isOwnerOfGroup: function(groupId, userId) {
//		if (!userId) {
//			userId = this.userId;
//		}
//		var user = Meteor.users.findOne({'_id': userId});
//		return Roles.userIsInRole(user, ['owner'], groupId);
//	}
//});
