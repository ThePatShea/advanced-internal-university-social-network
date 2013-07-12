Template.listItem.helpers({
    isGoing : function() {
      return _.contains(this.attendees,Meteor.user().username)
    }
});


Template.listItem.events({
    'click .post-item' : function() {
      Meteor.Router.to('postPage', this.bubbleId, this._id);
    }
});
