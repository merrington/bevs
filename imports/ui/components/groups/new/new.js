import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { newGroup } from '/imports/api/groups/methods.js';

import './new.html';

Template.newGroup.events({
  'click #createGroupBtn'(event) {
    event.preventDefault();
    newGroup.call({name: $('#groupName').val()}, function(error, id) {
      if (error) {
        console.log(error);
        // TODO: show an error message on the UI
        //$('#newGroupErrorMessage').removeClass('hidden');
      } else {
        FlowRouter.go('/groups/:id', {id: id});
          $('#newGroupModal').modal('hide');
      }
    });
  }
});
