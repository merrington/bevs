import { Template } from 'meteor/templating';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { newGroup } from '/imports/api/groups/methods.js';

import './add.html';

Template.add.events({
	'click #newGroupButton': function(event) {
		$('#newGroupModal').modal({
			onApprove: function() {
        $('#newGroupErrorMessage').addClass('hidden');
				newGroup.call({name: $('#groupName').val()}, function(error, id) {
					if (error) {
						console.log(error);
            $('#newGroupErrorMessage').removeClass('hidden');
					} else {
						FlowRouter.go('/groups/:id', {id: id});
					}
				});
			}
		}).modal('show');
	}
});

Template.add.onRendered(() => {
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  });
})
