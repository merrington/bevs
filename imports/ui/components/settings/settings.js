import { Template } from 'meteor/templating';

import './settings.html';
import './beerSettings/beerSettings.js';

Template.groupSettings.events({
});

Template.settingsBeerTab.events({
	'click .addBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$addToSet: {'beers': this.beer}});
	},
	'click .deleteBeerBtn': function(event) {
		Groups.update({'_id': Template.parentData(1)._id}, {$pull: {'beers': this.beer}});
	},
	'click #searchBtn, keypress #searchInput': function(event) {
		if (event.type === 'click' || event.which === 13) {
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
				}
			});
			Session.set('searched', "searching");
		}
	},
})

Template.settingsBeerTab.helpers({
	searched: function(value) {
		return Session.get('searched') === value;
	},
	beerResults: function() {
		return Session.get('beerResults');
	}
});

Template.groupSettings.onRendered(function() {
	$('#groupSettingsModal > div.content > div.ui.top.attached.tabular.menu .item').tab({
		onLoad: function() {
			$('#groupSettingsModal').modal('refresh');
		}
	});
})
