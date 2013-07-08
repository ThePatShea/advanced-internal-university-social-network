Template.postItem.events({
  'click .upvoteable': function(event) {
    event.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
