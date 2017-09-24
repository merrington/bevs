import { Meteor } from 'meteor/meteor';
import { Seasons } from '../Seasons';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('seasons.user', function userSeasons() {
  const slugs = Roles.getGroupsForUser(this.userId);
  return Seasons.find({ slug: { $in: slugs } });
});

Meteor.publish('season.slug', function slugSeason(slug) {
  return Seasons.find({ slug });
});
