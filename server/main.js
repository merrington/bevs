import { Meteor } from 'meteor/meteor';
import '/imports/startup/server/index.js';

Meteor.startup(() => {
  import '/imports/startup/server/rest';
});
