import { Template } from 'meteor/templating';

import { Groups } from '/imports/api/groups/groups.js';

import './beerSettings.html';

import '../../beers/beers.js';

Template.beerSettings.events({
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

Template.beerSettings.helpers({
	beers() {
		let instance = Template.instance();
		if (instance.data.beerDB) {
			return Template.instance().data.beerDB.find();
		}
	},
	searched: function(value) {
		return Session.get('searched') === value;
	},
	beerResults: function() {
		return Session.get('beerResults');
	}
});

Template.beerSettings.events({
	'click #addBeer'(event) {
		let itemId = event.currentTarget.dataset.id;
		let beerDB = Template.instance().data.beerDB;
		let found = beerDB.findOne({id: itemId});
		if (!found) {
			beerDB.insert(this);
		}
	},
	'click #deleteBeer'(event) {
		let itemId = event.currentTarget.dataset.id;
		let beerDB = Template.instance().data.beerDB;
		beerDB.remove({id: itemId});
	}
})
