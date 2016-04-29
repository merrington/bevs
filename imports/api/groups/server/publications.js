import { Meteor } from 'meteor/meteor';

import { Groups } from '../groups.js';

Meteor.publish('groups.user', function() {
	return Groups.find({'members': {$elemMatch: {'id': this.userId}}});
});

Meteor.publish('groups.id', function(id) {
	return Groups.find({_id: id, 'members': {$elemMatch: {'id': this.userId}}});
});
