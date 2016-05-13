import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Groups } from '/imports/api/groups/groups.js';

import { castVote } from '/imports/api/groups/methods.js';

import './votingModal.html';


Template.votingModal.onCreated(() => {
  let instance = Template.instance();
  let user = Groups.findOne().members.find((user) => {
    return user.id === Meteor.userId();
  });
  instance.user = user;
  let voteCounter = new ReactiveDict();
  instance.voteCounter = voteCounter;
  instance.autorun(() => {
    instance.subscribe('groups.id', instance.data.group._id);
  })
});

Template.votingModal.helpers({
  beers() {
    let instance = Template.instance();
    return instance.data.group.beers;
  },
  positiveVotes() {
    let instance = Template.instance();
    let positiveVotes = instance.voteCounter.get('positiveVotes');
    let upv = instance.user.positiveVotes; //user positive votes
    if (positiveVotes) {
      return Object.keys(positiveVotes).reduce((prev, curr) => {
        return prev - positiveVotes[curr];
      }, upv);
    } else {
      return upv;
    }
  },
  negativeVotes() {
    let instance = Template.instance();
    let negativeVotes = instance.voteCounter.get('negativeVotes');
    let unv = instance.user.negativeVotes; //user positive votes
    if (negativeVotes) {
      return Object.keys(negativeVotes).reduce((prev, curr) => {
        return prev - negativeVotes[curr];
      }, unv);
    } else {
      return unv;
    }
  }
});

Template.votingModal.events({
  'change input'(event) {
    let voteCounter = Template.instance().voteCounter;
    let target = event.currentTarget;
    if (target.name === 'positiveVote' && !isNaN(parseInt(target.value))) {
      let pv = voteCounter.get('positiveVotes') || {};
      pv[target.dataset.beer] = parseInt(target.value);
      voteCounter.set('positiveVotes', pv);
    } else if (target.name === 'negativeVote' && !isNaN(parseInt(target.value))) {
      let pv = voteCounter.get('negativeVotes') || {};
      pv[target.dataset.beer] = parseInt(target.value);
      voteCounter.set('negativeVotes', pv);
    } else {
      target.value = 0;
      $(target).trigger('change');
    }
  },
  'click #voteBtn'(event) {
    let voteCounter = Template.instance().voteCounter;
    let vote = {
      positiveVotes: voteCounter.get('positiveVotes') || {},
      negativeVotes: voteCounter.get('negativeVotes') || {}
    }
    console.log(Template.instance());
    castVote.call({vote, groupId: Template.instance().data.group._id}, function(error, result) {
      if (error) {
        console.log(error);
      } else {
        $('#voteModal').modal('hide');
      }
    });
  }
})
