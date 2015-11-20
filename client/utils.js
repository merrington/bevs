Template.registerHelper('log', function() {
	console.log(this);
});

Template.registerHelper('formatDate', function(date, format) {
	if (!format) {
		//format = 'MMM DDDo YYYY h:mma';
		format = 'MMM DD YYYY h:mma';
	}
	return moment.unix(date).format(format);
});