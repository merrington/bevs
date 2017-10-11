import { Mongo } from 'meteor/mongo';

export const Seasons = new Mongo.Collection('Seasons');

//TODO - Add index on `slug` field
