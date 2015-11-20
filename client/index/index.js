Template.addGroups.events({
	'click #newGroupButton': function(event) {
		$('#newGroupModal').modal({
			onApprove: function() {
				Meteor.call('newGroup', $('#groupName').val(), function(error, id) {
					if (error) {
						Materialize.toast('Error creating group, please try again!', 4000);
					} else {
						Router.go('groups.show', {_id: id});
					}
				});
			}
		}).modal('show');
	}
});

Template.listGroups.helpers({
	'points': function() {
		return _.find(this.members, function(item) {
			return item.id === Meteor.userId()
		}).points;
	},
	'votes': function() {
		return _.find(this.members, function(item) {
			return item.id === Meteor.userId()
		}).votes;
	}
})