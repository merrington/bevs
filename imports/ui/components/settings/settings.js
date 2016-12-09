import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import { Groups } from '/imports/api/groups/groups.js';

import { updateGroupSettings } from '/imports/api/groups/methods.js';

import './settings.html';
import './beerSettings/beerSettings.js';
import './pointsSettings/pointsSettings.js';
import './membersSettings/membersSettings.js';

Template.groupSettings.onCreated(() => {
	  const instance = Template.instance();
	  let beerDB = new Mongo.Collection(null);

	  instance.autorun(() => {
		    if (instance.data.group.beers) {
			      instance.data.group.beers.forEach((beer) => {
				        beerDB.insert(beer);
			      });
		    }
		    instance.beerDB = beerDB;
	  });
});

Template.groupSettings.helpers({
	  beers() {
		    return Template.instance().beerDB;
	  }
});

Template.groupSettings.events({
	  'click #saveSettings'(event, instance) {
		    let group = {};

		    group.beers = instance.beerDB.find({}, {sort: {name: 1}, fields: {_id: false}}).fetch();
        group.points = {
            starterPositiveVotes: parseInt(instance.$('#starterPositiveVotes').val()),
            starterNegativeVotes: parseInt(instance.$('#starterNegativeVotes').val()),
            refreshPositiveVotes: parseInt($('#refreshPositiveVotes').val()),
            refreshNegativeVotes: parseInt($('#refreshNegativeVotes').val()),
            seasonWinPoints: parseInt($('#seasonWinPoints').val()),
            positiveValue: $('#positiveValue').val(),
            negativeValue: $('#negativeValue').val(),
            loserVpBonus: parseInt($('#loserVpBonus').val())
		    };

		updateGroupSettings.call({groupId: instance.data.group._id, settings: group});
	}
});
