Template.newGroup.events({
	'click #createGroupBtn': function(event) {
		Meteor.call('newGroup', $('#groupName').val(), function(error, id) {
			if (error) {
				Materialize.toast('Error creating group, please try again!', 4000);
			} else {
				Router.go('groups.show', {_id: id});
			}
		});
	}
});