Template.loginMenu.events({
	'click #loginLink': function(event) {
		Meteor.loginWithGoogle({
			'requestPermissions': ['openid', 'profile', 'email'],
			'loginStyle': 'popup',
			'redirectUrl': Meteor.absoluteUrl({'path': 'https://localhost:3000/_oauth/google'})
		});
	},

	'click #logoutLink': function(event) {
		Meteor.logout();
	}
});

Template.loginMenu.onRendered(function() {
	Meteor.subscribe("userData");
});
