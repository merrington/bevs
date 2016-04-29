///*
//Add roles to the users
//*/
//Meteor.startup(function() {
//	//get all the users in the group
//	var group, groupUsers = [];
//	group = Groups.findOne({'_id':'rJfEwfR6w9h92Mqts'});
//	if (group) {
//		console.log("Found the group");
//		groupUsers = _.pluck(group.members, 'id');
//		Meteor.users.find({'_id': {$in: groupUsers}}).forEach(function(user) {
//			console.log("Adding role to user");
//			Roles.addUsersToRoles(user._id, ['user'], group._id);
//		})
//	}
//});
