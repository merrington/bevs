Template.addGroups.onRendered(function() {
	$('.modal-trigger').leanModal();
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