Meteor.publish('groups', function(id) {
	if (id) {
		return Groups.find({'_id': id, 'members': {$elemMatch: {'id':this.userId}}}, {fields: {'voting.votes': 0, 'history.votes': 0}});
	}
	return Groups.find({'members': {$elemMatch: {'id':this.userId}}});
})

Meteor.publish('userData', function(groupId) {
	if (groupId) {
		var groupUsers = _.pluck(Groups.findOne({'_id': groupId}).members, 'id');
		return Meteor.users.find({'_id': {$in: groupUsers}})
	}
})
