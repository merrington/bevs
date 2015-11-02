Meteor.methods({
	'searchBDB': function(searchText) {
		var i, results = [], beerResults = HTTP.get("http://api.brewerydb.com/v2/search", {
			params: {
				q: searchText,
				type: 'beer',
				key: Meteor.settings.bdb_key
			}
		});

		beerResults = beerResults.data.data;
		for (i=0; i<beerResults.length; i++) {
			results.push({
				'id': beerResults[i].id,
				'name': beerResults[i].name,
				'style': beerResults[i].style && beerResults[i].style.shortName,
				'image': beerResults[i].labels && beerResults[i].labels.large
			});
		}

		console.log(results);
		return results;
	}
})