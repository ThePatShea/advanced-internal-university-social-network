Template.postItem.helpers({
  hasPermission: function() {
    var bubble = Bubbles.findOne(this.bubbleId);
    userList = bubble.users.admins;
    userList.push(this.userId);
    return _.contains(userList, Meteor.userId())
  },
  getPostType: function(postType) {
    return this.postType === postType;
  }

});

Template.postItem.events({
  'click .upvoteable': function(event) {
    event.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
