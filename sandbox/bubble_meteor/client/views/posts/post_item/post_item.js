Template.postItem.helpers({
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
