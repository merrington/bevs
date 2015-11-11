Template.newGroup.events({
	'click #createGroupBtn': function(event) {
		group = {
			name: $('#groupName').val(),
			members: [{
				'id': Meteor.userId(),
				'points': 0,
				'votes': 0,
				'roles': ['owner']
			}]
		}
		Meteor.call('newGroup', group, function(error, id) {
			if (error) {
				Materialize.toast('Error creating group, please try again!', 4000);
			} else {
				Router.go('groups.show', {_id: id});
			}
		});
	}
})