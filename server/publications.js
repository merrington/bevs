Meteor.publish('groups', function(id) {
	if (id) {
		return Groups.find({'_id': id, 'members': {$elemMatch: {'id':this.userId}}}, {fields: {'voting.votes': 0}});
	}
	return Groups.find({'members': {$elemMatch: {'id':this.userId}}});
})