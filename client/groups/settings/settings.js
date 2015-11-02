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
	},
	'click .addBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$addToSet: {'beers': this}});
	},
	'click .deleteBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$pull: {'beers': this}});
	}
});

Template.groupSettings.helpers({
	searched: function() {
		return Session.get('searched');
	},
	beerResults: function() {
		return Session.get('beerResults');
	}
});

