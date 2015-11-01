Template.newGroup.events({
	'click #createGroupBtn': function(event) {
		group = {
			name: $('#groupName').val(),
			owner: Meteor.userId(),
			members: [{
				'id': Meteor.userId(),
				'points': 0,
				'votes': 0
			}]
		}
		Groups.insert(group, function(error, id) {
			if (error) {
				Materialize.toast('Error creating group, please try again!', 4000);
			} else {
				Router.go('groups.show', {_id: id});
			}
		});
	}
})