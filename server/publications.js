//Meteor.publish('userData', function(groupId) {
//	if (groupId) {
//		var groupUsers = _.pluck(Groups.findOne({'_id': groupId}).members, 'id');
//		return Meteor.users.find({'_id': {$in: groupUsers}})
//	}
//})
