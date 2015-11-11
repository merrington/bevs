Groups = new Mongo.Collection('groups');

Meteor.methods({
	'newGroup': function(group) {
		Groups.insert(group, function(error, id) {
			if (error) {
				throw "Error creating";
			} else {
				return id;
			}
		});
	}
})