Template.eventItem.helpers({
    isGoing : function() {
      return _.contains(this.attendees,Meteor.user().username)
    }
});


Template.eventItem.events({
    'click .post-item' : function() {
      Meteor.Router.to('postPage', this.bubbleId, this._id);
    }
});
