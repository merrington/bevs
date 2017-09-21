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
