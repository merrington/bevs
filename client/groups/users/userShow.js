Template.userName.helpers({
  username: function() {
    var userId = this.id;
    return Meteor.users.findOne({'_id': userId}).profile.name;
  }
})
Template.userAvatar.helpers({
  image: function() {
    var userId = this.id;
    return Meteor.users.findOne({'_id': userId}).profile.image;
  }
})
