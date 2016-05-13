Template.registerHelper('log', function(item) {
	if (typeof item !== 'undefined') {
		console.log('log item', item);
	} else {
		console.log('log', this);
	}
});

Template.registerHelper('formatDate', function(date, format) {
	if (!format) {
		//format = 'MMM DDDo YYYY h:mma';
		format = 'MMM DD YYYY h:mma';
	}
	return moment.unix(date).format(format);
});

Template.registerHelper("sort", function(list, sortBy){
	return _.sortBy(list, sortBy).reverse()
});
