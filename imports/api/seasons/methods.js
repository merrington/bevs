import { Seasons } from './Seasons';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { ValidationError } from 'meteor/mdg:validation-error';
import { Roles } from 'meteor/alanning:roles';
import slugify from 'slugify';

export const newSeason = new ValidatedMethod({
  name: 'seson.new',
  validate: ({ name }) => {
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
    const seasonId = Seasons.insert({
      name,
      slug,
      owner: this.userId,
      members: [this.userId]
    });

    Roles.addUsersToRoles(this.userId, ['owner', 'player'], slug);

    return slug;
  }
});

export const addBeer = new ValidatedMethod({
  name: 'season.addBeer',
  validate({ beer, slug }) {
    const userIsAdmin = Roles.userIsInRole(this.userId, 'owner', slug);
    if (!userIsAdmin) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }

    if (!beer) {
      throw new ValidationError({
        name: 'bad-beer',
        type: 'Invalid beer'
      });
    }
  },
  run({ beer, slug }) {
    return Seasons.update({ slug }, { $addToSet: { beers: beer } });
  }
});

export const deleteBeer = new ValidatedMethod({
  name: 'season.deleteBeer',
  validate({ slug }) {
    const userIsAdmin = Roles.userIsInRole(this.userId, 'owner', slug);
    if (!userIsAdmin) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }
  },
  run({ beer, slug }) {
    return Seasons.update({ slug }, { $pull: { beers: beer } });
  }
});

export const updateSetting = new ValidatedMethod({
  name: 'season.updateSetting',
  validate({ name, value, slug }) {
    const userIsAdmin = Roles.userIsInRole(this.userId, 'owner', slug);
    if (!userIsAdmin) {
      throw new Meteor.Error('not-owner', 'Not an owner');
    }
  },
  run({ name, value, slug }) {
    return Seasons.update({ slug }, { $set: { [`settings.${name}`]: value } });
  }
});
