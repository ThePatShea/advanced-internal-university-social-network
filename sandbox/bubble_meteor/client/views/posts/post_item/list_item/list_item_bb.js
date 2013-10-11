Template.listItemBB.helpers({
    getPostAsUser: function() {
      //return Meteor.users.findOne(this.postAsId);
      //console.log("ES: ", es.exploreUsers.toJSON());
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
      return _.contains(this.attendees, Meteor.userId());
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
    },

    isAdminBB: function(){
      var isadmin = mybubbles.isAdmin(Meteor.userId());
      console.log('Is Admin: ', isadmin);
      return isadmin;
    }
});

Template.listItemBB.events({
    'click .post-item' : function(evt) {
      evt.preventDefault();
      evt.stopPropagation();
      if(typeof this.bubbleId != 'undefined'){
        // Links to parent post if the post is a file attachment. Otherwise, links to the post itself.
          if (this.postType == 'file' && this.parent){
            Meteor.Router.to('postPageBackbone', this.bubbleId, this.parent);
          }
          else if(this.postType == 'file'){
            console.log('List item click.');
            Meteor.Router.to('postPageBackbone', this.bubbleId, this.id);
          }
          else if(typeof this.postType != 'undefined'){
            Meteor.Router.to('postPageBackbone', this.bubbleId, this.id);
          }
      }
      else if(typeof this.exploreId != 'undefined'){
        if(this.postType == 'file')
        {
          window.open(this.file,'_.blank');
        }
        else
        {
          Meteor.Router.to('explorePostPageBB', this.exploreId, this.id);
        }
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

Template.listItemBB.created = function() {
  mto = "";
}

Template.listItemBB.rendered = function(){
  // console.log("LIBB: ", this);
  //Log clicking of individual bubble
  $(".post-item").on("click", function() {
    // Meteor.clearTimeout(mto);
    // mto = Meteor.setTimeout(function() {
      //Extract and append the bubble's title to action string
      var title = 'click-post_'+$(".post-item").attr('class').split('name-')[1];
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: title }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    // }, 500);
  });
}
