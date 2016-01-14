Template.voting.helpers({
	sortedBeers: function() {
		var beers = this.beers;
		if (beers) {
			//console.log(beers);
			beers.sort(function(beer1, beer2) {
				//console.log(beer1.name, beer2.name);
			//console.log(beer1.name.localeCompare(beer2.name));
				//return beer1.name - beer2.name;
			return beer1.name.localeCompare(beer2.name);
		});
			//console.log(beers);
			return beers;
		}
	},
	votingErrorMessage: function() {
		return Session.get('votingErrorMessage');
	}
})
