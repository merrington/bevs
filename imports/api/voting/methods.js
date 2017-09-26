import { Seasons } from '../seasons/Seasons';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Roles } from 'meteor/alanning:roles';
import get from 'lodash/get';

export const openVoting = new ValidatedMethod({
  name: 'voting.open',
  validate({ slug }) {
    const season = Seasons.findOne({ slug });
    const votingOpen = get(season, 'voting.open', false);
    if (votingOpen) {
      throw new Meteor.Error('voting-open', 'Voting already open');
    }
  },
  run({ slug }) {
    Seasons.update({ slug }, { $set: { 'voting.open': true } });
  }
});

export const closeVoting = new ValidatedMethod({
  name: 'voting.close',
  validate({ slug }) {
    const votingOpen = get(season, 'voting.open', false);
    if (!votingOpen) {
      throw new Meteor.Error('voting-closed', 'Voting already closed');
    }
  },
  run({ slug }) {
    Seasons.update({ slug }, { $set: { 'voting.open': false } });
  }
});
