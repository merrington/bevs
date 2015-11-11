Template.groupSettings.events({
	'click #searchBtn': function(event) {
		Meteor.call('searchBDB', $('#searchInput').val(), function(error, result) {
			if (error) {
				console.log(error);
			} else {
				if (result.length === 0) {
					Session.set('searched', 0);
				} else {
					Session.set('beerResults', result);
					Session.set('searched', "searched");
				}
				console.log(result);
			}
		});
		Session.set('searched', "searching");
	},
	'click .addBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$addToSet: {'beers': this}});
	},
	'click .deleteBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$pull: {'beers': this}});
	},
	'click #accept': function(event) {
		var newSettings = {
			'points': {
				'starterPoints': $('#starterPoints').val(),
				'refreshPoints': $('#refreshPoints').val(),
				'seasonWinPoints': $('#seasonWinPoints').val(),
				'againstValue': $('#againstValue').val(),
				'loserVpBonus': $('#loserVpBonus').val(),
			}
		}
		Meteor.call('updateGroupSettings', this._id, newSettings);
	}
});

Template.settingsBeerTab.helpers({
	searched: function(value) {
		return Session.get('searched') === value;
	},
	beerResults: function() {
		return Session.get('beerResults');
	}
});

Template.groupSettings.onRendered(function() {
	$('ul.tabs').tabs();
})

