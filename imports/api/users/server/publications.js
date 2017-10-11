import { Meteor } from 'meteor/meteor';

Meteor.publish('users.season', slug => {
  return Meteor.users.find(
    { 'seasons.slug': slug },
    {
      fields: {
        profile: 1,
        'seasons.slug': 1,
        'seasons.points': 1
      }
    }
  );
});

Meteor.publish('userData', function publishUserData() {
  if (this.userId) {
    return Meteor.users.find(this.userId, {
      fields: {
        seasons: 1
      }
    });
  } else {
    this.ready();
  }
});
