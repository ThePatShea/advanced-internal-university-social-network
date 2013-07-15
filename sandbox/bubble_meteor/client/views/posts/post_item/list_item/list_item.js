Template.listItem.helpers({
    isGoing : function() {
      return _.contains(this.attendees,Meteor.user().username)
    }
  , hasChildren : function() {
      if (this.children != undefined && this.children != "")
        return true;
      else
        return false;
    }
});

Template.listItem.events({
    'click .post-item' : function() {
      // Links to parent post if the post is a file attachment. Otherwise, links to the post itself.
        if (this.postType == 'file' && this.parent)
          Meteor.Router.to('postPage', this.bubbleId, this.parent);
        else
          Meteor.Router.to('postPage', this.bubbleId, this._id);
    }
});
