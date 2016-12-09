import './membersSettings.html';

import { Template } from 'meteor/templating';
import { Groups } from '/imports/api/groups/groups.js';
import { addUser } from '/imports/api/groups/methods.js';

Template.membersSettings.helpers({
    users() {
        return Groups.findOne().members.map((user) => {
            return Meteor.users.findOne({_id: user.id});
        });
    }
});

Template.membersSettings.events({
    'click #addUserBtn'(event, instance) {
        let username = instance.$('#addUser').val(); 
        let groupId = Groups.findOne()._id;
        addUser.call({username, groupId}, (err, result) => {
            instance.$('#addUser').val('');
        });
    }
});
