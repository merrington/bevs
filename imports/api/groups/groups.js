import { Mongo } from 'meteor/mongo';

class GroupsCollection extends Mongo.Collection {
	insert({name, ownerId}, callback) {
		group = {
			name: name,
			members: [{
				'id': ownerId,
				'points': 0,
				'votes': 0,
			}]
		};

		return super.insert(group, callback);
	}
}

export const Groups = new GroupsCollection('groups');
