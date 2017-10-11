import { Restivus } from 'meteor/nimble:restivus';
import { Seasons } from '/imports/api/seasons/Seasons';
import { castVote } from '/imports/api/voting/methods';

const api = new Restivus({
  version: 'v1',
  apiPath: 'api/',
  auth: {
    token: 'apiKey'
  },
  prettyJson: true
});

api.addRoute('/users/me', {
  authRequired: true,
  get() {
    console.log('here');
    return Meteor.users.findOne(this.userId);
  }
});

api.addRoute('/seasons/:slug', {
  authRequired: true,
  get() {
    const slug = this.urlParams.slug;

    if (this.user.seasons.find(season => season.slug === slug)) {
      return Seasons.findOne({ slug }).fetch();
    }
    return {
      statusCode: 403,
      body: 'Not a player in season'
    };
  }
});

api.addRoute('/seasons/:slug/vote', {
  authRequired: true,
  post() {
    const slug = this.urlParams.slug;
    const votes = this.bodyParams.votes;

    return castVote.call({ slug, votes });
  }
});
