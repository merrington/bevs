ServiceConfiguration.configurations.upsert(
  { service: "google" },
  {
    $set: {
      clientId: Meteor.settings.google.clientId,
      loginStyle: "popup",
      secret: Meteor.settings.google.secret
    }
  }
);


Accounts.onCreateUser(function(options, user) {
	user.profile = options.profile;
	if (user.services.google) {
		user.profile.image = user.services.google.picture;
		user.profile.given_name = user.services.google.given_name;
		user.profile.family_name = user.services.google.family_name;
    user.username = user.services.google.email;
	}
	return user;
})
