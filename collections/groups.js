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
	}
})