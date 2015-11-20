Groups = new Mongo.Collection('groups');

Meteor.methods({
	'newGroup': function(name) {
		var self = this;
		group = {
			name: name,
			members: [{
				'id': self.userId,
				'points': 0,
				'votes': 0,
			}]
		}

		return Groups.insert(group, function(error, id) {
			if (error) {
				throw "Error creating";
			} else {
				Roles.addUsersToRoles(self.userId, ['owner'], id);
				return id;
			}
		});
	},
	'updateGroupSettings': function(groupId, newSettings) {
		var group = Groups.findOne({'_id': groupId});
		var user = Meteor.users.findOne({'_id': this.userId});
		if (Roles.userIsInRole(user, ['owner'], groupId)) {
			group = _.extend(group, newSettings);
			Groups.update({'_id': groupId}, group);
		}
	},
	isOwnerOfGroup: function(groupId, userId) {
		if (!userId) {
			userId = this.userId;
		}
		var user = Meteor.users.findOne({'_id': userId});
		return Roles.userIsInRole(user, ['owner'], groupId);
	}
});
