import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Random } from 'meteor/random';

export const generateAPIKey = new ValidatedMethod({
  name: 'user.generateAPIKey',
  validate: null,
  run() {
    const apiKey = Random.id(16);

    Meteor.users.update(this.userId, { $set: { apiKey } });
    return apiKey;
  }
});
