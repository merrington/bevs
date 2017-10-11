import { Meteor } from 'meteor/meteor';
import { Seasons } from '../Seasons';

Meteor.publish('seasons.user', function userSeasons() {
  const user = Meteor.users.findOne(this.userId);
  if (user.seasons) {
    const slugs = user.seasons.map(season => season.slug);
    return Seasons.find({ slug: { $in: slugs } });
  } else {
    this.ready();
  }
});

Meteor.publish('seasons.slug', function slugSeason(slug) {
  return Seasons.find({ slug });
});
