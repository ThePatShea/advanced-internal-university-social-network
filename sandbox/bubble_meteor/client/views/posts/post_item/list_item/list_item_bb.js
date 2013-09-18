Template.listItemBB.helpers({
    getPostAsUser: function() {
      //return Meteor.users.findOne(this.postAsId);
      return this.user;
    },
    /*
    getPostAsBubble: function() {
      var bubble = Bubbles.findOne(this.postAsId);
      return bubble;
    },*/
    getPostAsBubble: function() {
      //var bubble = new BBubble({_id: this.postAsId}).fetch();
      return this.bubble;
    },
    postedAsUser: function() {
      if (this.postAsType == "user") {
        return true;
      } else {
        return false;
      }
    },
    postedAsBubble: function() {
      if (this.postAsType == "bubble") {
        return true;
      } else {
        return false;
      }
    },
    displayName: function() {
      if (this.postAsType == "user") {
        return this.author;
      } else if (this.postAsType == "bubble") {
        //var bubble = Bubbles.findOne(this.postAsId);
        //var bubble = new BBBubble({id: this.postAsId});
        return this.bubble.title;
      }
    },
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
     return(this.id == Meteor.userId());
    },

    inBubble: function(){
      return(Meteor.Router.page() == "bubbleMembersPage");
    },

    isFile: function(){
      if(this.postType == 'file'){
        return true;
      }
    },

    isDiscussion: function(){
      if(this.postType == 'discussion'){
        return true;
      }
    }
});

Template.listItemBB.events({
    'click .post-item' : function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if(typeof this.bubbleId != 'undefined'){
        // Links to parent post if the post is a file attachment. Otherwise, links to the post itself.
          if (this.postType == 'file' && this.parent){
            Meteor.Router.to('postPage', this.bubbleId, this.parent);
          }
          else if(this.postType == 'file'){
            console.log('List item click.');
            Meteor.Router.to('postPage', this.bubbleId, this.id);
          }
          else if(typeof this.postType != 'undefined'){
            console.log(this.id);
            Meteor.Router.to('postPage', this.bubbleId, this.id);
          }
      }
      else if(typeof this.exploreId != 'undefined'){
        Meteor.Router.to('explorePostPage', this.exploreId, this.id);
      }
      else if(typeof this.userType != 'undefined'){
        Meteor.Router.to('userProfile', this.id);
      }
      else if(typeof this.category != 'undefined'){
        Meteor.Router.to('bubblePage', this.id);
      }
      else{
        Meteor.Router.to('404NotFoundPage');
      }
    }
});

Template.listItemBB.rendered = function(){
}
