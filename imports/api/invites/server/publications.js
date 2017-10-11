import { Meteor } from 'meteor/meteor';
import { Invites } from '../Invites';

Meteor.publish('invites.token', token => Invites.find({ token }));
