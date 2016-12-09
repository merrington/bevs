import { Mongo } from 'meteor/mongo';

class GroupsCollection extends Mongo.Collection {
	insert({name, ownerId}, callback) {
		group = {
			  name: name,
        beers: [],
        members: []
		};

		return super.insert(group, callback);
	}
}

export const Groups = new GroupsCollection('groups');
