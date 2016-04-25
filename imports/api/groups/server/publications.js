import { Meteor } from 'meteor/meteor';

import { Groups } from '../groups.js';

Meteor.publish('groups', function() {
	return Groups.find({'members': {$elemMatch: {'id': this.userId}}});
})
