import { ServiceConfiguration } from 'meteor/service-configuration';

//setup google oauth
ServiceConfiguration.configurations.upsert(
  { service: 'google' },
  {
    $set: {
      clientId: Meteor.settings.google.clientId,
      loginStyle: 'popup',
      secret: Meteor.settings.google.secret
    }
  }
);

//Deny updating users collection from client
Meteor.users.deny({
  update() {
    return true;
  }
});

//Setup fields on creating new user
Accounts.onCreateUser((options, user) => {
  console.log(options, user);
  const customizedUser = user;

  if (options.profile) {
    customizedUser.profile = options.profile;
  }

  if (user.services.google && user.services.google.picture) {
    customizedUser.profile.picture = user.services.google.picture;
  } else {
    customizedUser.profile.picture = Meteor.absoluteUrl('images/profile.svg');
  }

  return customizedUser;
});
