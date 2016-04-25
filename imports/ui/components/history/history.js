import { Template } from 'meteor/templating';

import './history.html';

Template.history.helpers({
	history: function() {
		if (this.history) {
			return this.history.sort(function(vote1, vote2) {
				return vote2.date - vote1.date;
			});
		}
	},
	winningBeer: function(totals) {
		var self = this;
		return _.find(Groups.findOne().beers, function(beer) {
			return beer.id === totals[0].id;
		});
	},
	votes: function(totals) {
		var self = this;
		return _.find(totals, function(total) {
			return self.beer.id === total.id;
		}).total;
	},
	beerTotals: function(beers) {
		var totals = this.totals;
		var newBeers = beers.map(function(beer, index) {
			var beerHistory = _.find(totals, function(total) {
				return total.id == beer.id;
			});
			beer.total = beerHistory && beerHistory.total || 0;
			return beer;
		});

		return newBeers.sort(function(beer1, beer2) {
			return beer2.total - beer1.total;
		});

//		beers.forEach(function (beer) {
//			beerHistory = _.find(totals, function(total) {
//				return total.id == beer.id;
//			});
//			beer.total = beerHistory && beerHistory.total || 0;
//		});
//
//		return beers.sort(function(beer1, beer2) {
//			return beer2.total - beer1.total;
//		});
	},
	total: function(totals) {
		var beer = this.beer;
		return _.find(totals, function(total) {
			return total.id === beer.id;
		}).total;
	},
	winner: function() {
		var history = this;
		if (history.winner && history.winner.length === 1) {
			if (history.winner[0].highestVote.length === 1) {
				return Meteor.users.findOne({'_id': history.winner[0].highestVote[0].user}).profile.name;
			} else {
				return 'Vote tie!';
			}
		} else {
			return 'Beer tie!';
		}
	}
});
