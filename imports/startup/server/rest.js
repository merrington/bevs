import { Restivus } from 'meteor/nimble:restivus';
import { Seasons } from '/imports/api/seasons/Seasons';
import { castVote } from '/imports/api/voting/methods';

const api = new Restivus({
  version: 'v1',
  apiPath: 'api',
  auth: {
    token: 'apiKey',
    user: function() {
      return {
        userId: this.request.headers['x-user-id'],
        token: this.request.headers['x-auth-token']
      };
    }
  },
  prettyJson: true
});

api.addRoute('users/me', {
  authRequired: true,
  get: {
    authRequired: true,
    action() {
      return Meteor.users.findOne(this.userId, {
        fields: {
          seasons: 1
        }
      });
    }
  }
});

api.addRoute('seasons/:slug', {
  authRequired: true,
  get: {
    authRequired: true,
    action() {
      const slug = this.urlParams.slug;

      if (this.user.seasons.find(season => season.slug === slug)) {
        return Seasons.findOne({ slug });
      }
      return {
        statusCode: 403,
        body: 'Not a player in season'
      };
    }
  }
});

api.addRoute('seasons/:slug/vote', {
  authRequired: true,
  post: {
    authRequired: true,
    action() {
      const slug = this.urlParams.slug;
      const votes = this.bodyParams.votes;

      return castVote.call({ slug, votes, userId: this.userId });
    }
  }
});
