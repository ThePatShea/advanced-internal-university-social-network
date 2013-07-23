Template.listItem.helpers({
    isGoing : function() {
      return _.contains(this.attendees,Meteor.user().username)
    },

    hasChildren : function() {
      if (this.children != undefined && this.children != "")
        return true;
      else
        return false;
    },

    membershipCount: function(){
      var currentUserId = this._id;
      if(typeof this.userType != 'undefined'){
        return Bubbles.find({$or: [{'users.members': currentUserId}, {'users.admins': currentUserId}]}).count();
      }
      else{
        return -1;
      }
    },

    isMe: function(){
     return(this._id == Meteor.userId());
     alert(this._id);
    },

    inBubble: function(){
      return(Session.get("currentBubbleId"));
    }
});

Template.listItem.events({
    'click .post-item' : function() {
      // Links to parent post if the post is a file attachment. Otherwise, links to the post itself.
        if (this.postType == 'file' && this.parent){
          Meteor.Router.to('postPage', this.bubbleId, this.parent);
        }
        else if(typeof this.postType != 'undefined'){
          Meteor.Router.to('postPage', this.bubbleId, this._id);
        }
        else if(typeof this.userType != 'undefined'){
          Meteor.Router.to('userProfile', this._id);
        }
        else if(typeof this.category != 'undefined'){
          Meteor.Router.to('bubblePage', this._id);
        }
        else{
          Meteor.Router.to('404NotFoundPage');
        }

    }
});
