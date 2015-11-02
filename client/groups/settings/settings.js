Template.groupSettings.events({
	'click #searchBtn': function(event) {
		Meteor.call('searchBDB', $('#searchInput').val(), function(error, result) {
			if (error) {
				console.log(error);
			} else {
				Session.set('beerResults', result);
				Session.set('searched', true);
				console.log(result);
			}
		});
	}
});

Template.groupSettings.helpers({
	searched: function() {
		return Session.get('searched');
	},
	beerResults: function() {
		return Session.get('beerResults');
	}
})