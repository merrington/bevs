import { Seasons } from './Seasons';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ValidationError } from 'meteor/mdg:validation-error';
import get from 'lodash/get';
import slugify from 'slugify';

function isSeasonStarted(slug) {
  return Seasons.findOne({ slug }).started;
}

function userIsAdmin(userId, slug) {
  const user = Meteor.users.findOne(userId);
  return get(user, 'seasons', []).find(
    season => season.slug === slug && season.role === 'owner'
  );
}

export const newSeason = new ValidatedMethod({
  name: 'seson.new',
  validate({ name }) {
    if (typeof name !== 'string') {
      throw new ValidationError([
        {
          name,
          type: 'Wrong type'
        }
      ]);
    } else {
      const slug = slugify(name);
      const seasonExists = Seasons.findOne({ $or: [{ name }, { slug }] });
      if (name.length < 1) {
        throw new ValidationError([
          {
            name,
            type: 'is too short'
          }
        ]);
      }
      if (seasonExists) {
        throw new ValidationError([
          {
            name: 'season',
            type: 'with this name already exists'
          }
        ]);
      }
    }
  },
  run({ name }) {
    const slug = slugify(name);
    Seasons.insert({
      name,
      slug
    });
    Meteor.users.update(this.userId, {
      $addToSet: {
        seasons: { slug, role: 'owner' }
      }
    });

    return slug;
  }
});

export const addBeer = new ValidatedMethod({
  name: 'season.addBeer',
  validate({ beer, slug }) {
    if (!userIsAdmin(this.userId, slug)) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }

    if (!beer) {
      throw new ValidationError({
        name: 'bad-beer',
        type: 'Invalid beer'
      });
    }

    if (isSeasonStarted(slug)) {
      throw new Meteor.Error('season-started', 'Season already started');
    }
  },
  run({ beer, slug }) {
    return Seasons.update({ slug }, { $addToSet: { beers: beer } });
  }
});

export const deleteBeer = new ValidatedMethod({
  name: 'season.deleteBeer',
  validate({ slug }) {
    if (!userIsAdmin(this.userId, slug)) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }

    if (isSeasonStarted(slug)) {
      throw new Meteor.Error('season-started', 'Season already started');
    }
  },
  run({ beer, slug }) {
    return Seasons.update({ slug }, { $pull: { beers: beer } });
  }
});

export const updateSetting = new ValidatedMethod({
  name: 'season.updateSetting',
  validate({ name, value, slug }) {
    if (!userIsAdmin(this.userId, slug)) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }

    if (isSeasonStarted(slug)) {
      throw new Meteor.Error('season-started', 'Season already started');
    }
  },
  run({ name, value, slug }) {
    return Seasons.update({ slug }, { $set: { [`settings.${name}`]: value } });
  }
});

export const startSeason = new ValidatedMethod({
  name: 'season.start',
  validate({ slug }) {
    if (!userIsAdmin(this.userId, slug)) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }

    if (isSeasonStarted(slug)) {
      throw new Meteor.Error('season-started', 'Season already started');
    }
  },
  run({ slug }) {
    const season = Seasons.findOne({ slug });
    //set the votes for all of the users
    Meteor.users.update(
      { 'seasons.slug': slug },
      {
        $set: {
          'seasons.$.votes': {
            positive: season.settings.startingVote.positive,
            negative: season.settings.startingVote.negative
          },
          'seasons.$.points': 0
        }
      }
    );

    //update the season with `started` true and `players` with votes
    Seasons.update({ slug }, { $set: { started: true, nextPoints: 1 } });
  }
});
