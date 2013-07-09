Template.eventItem.events({
  'click .post-item': function() {
    Meteor.Router.to('postPage', this.bubbleId, this._id);
  }
});
