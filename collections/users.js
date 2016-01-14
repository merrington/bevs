Meteor.methods({
  'users/getNameById':function(userId){
     Meteor.users.findOne({'_id': Meteor.userId()}).profile.name;
  }
});
