Template.group.events({
	'click #startVote': function(event) {
		voting = {
			votes: []
		}
		Groups.update(this._id, {$set: {voting: voting}});
		$('#votingModal').openModal();
	},
	'click #castVote': function(event) {
		$('#votingModal').openModal();
	},
	'click #groupSettings': function(event) {

	}
});

Template.group.onRendered(function() {
	$('.modal-trigger').leanModal();

	var voting = this.data.voting;
	if (voting) {
		if (!_.find(voting.votes, function(vote) { return vote.userId === Meteor.userId(); })) {
			$('#votingModal').openModal();
		}
	}
});

Template.group.helpers({
	owner: function() {
		return this.owner === Meteor.userId();
	}
})