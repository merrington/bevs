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
		$('#groupSettingsModal').openModal();
	}
});

Template.group.onRendered(function() {
	var voting = this.data && this.data.voting;
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