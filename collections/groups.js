Groups = new Mongo.Collection('groups');

Meteor.methods({
	'newGroup': function(name) {
		group = {
			name: name,
			members: [{
				'id': this.userId,
				'points': 0,
				'votes': 0,
				'roles': ['owner']
			}]
		}

		return Groups.insert(group, function(error, id) {
			if (error) {
				throw "Error creating";
			} else {
				return id;
			}
		});
	},
	'updateGroupSettings': function(groupId, newSettings) {
		var group = Groups.findOne({'_id': groupId});
		if (Meteor.call('isOwnerOfGroup', group)) {
			group = _.extend(group, newSettings);
			Groups.update({'_id': groupId}, group);
		}
	},
	isOwnerOfGroup: function(group) {
		if (group) {
			return _.findWhere(group.members, {'id': this.userId});
		}
	}
});
