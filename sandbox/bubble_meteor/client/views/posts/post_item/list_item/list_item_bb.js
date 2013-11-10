Template.listItemBB.helpers({
    getPostAsUser: function() {
      return this.user;
    },
    getPostAsBubble: function() {
      //var bubble = new BBubble({_id: this.postAsId}).fetch();
      return this.bubble;
    },
    postedAsUser: function() {
      if (this.postAsType === 'user') {
        return true;
      } else {
        return false;
      }
    },
    postedAsBubble: function() {
      if (this.postAsType === 'bubble') {
        return true;
      } else {
        return false;
      }
    },
    displayName: function() {
      if (this.postAsType === 'user') {
        return this.author;
      } else if (this.postAsType === 'bubble') {
        if (this.bubble)
          return this.bubble.title;

        // TODO: Error logging?
        return '';
      }
    },
    isGoing : function() {
      return _.contains(this.attendees, Meteor.userId());
    },

    hasChildren : function() {
      if (this.children != undefined && this.children !== '')
        return true;
      else
        return false;
    },

    membershipCount: function(){
      if (this.bubble)
        return this.bubble.users.admins.length + this.bubble.users.members.length;

      return -1;
    },

    isMe: function() {
      return Meteor.userId() == this.id;
    },

    inBubble: function(){
      // TODO: Use Meteor.Router.page()
      //return(Meteor.Router.page() == "bubbleMembersPage");

      var sitePath = window.location.pathname.split('/')[1];
      return sitePath === 'mybubbles';
    },

    isFile: function() {
      return this.postType === 'file';
    },

    isDiscussion: function() {
      return this.postType === 'discussion';
    },

    isAdminBB: function() {
      if (this.bubble)
        return _.contains(this.bubble.users.admins, Meteor.userId());

      return false;
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
        Meteor.Router.to('bubblePageBackbone', this.id);
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
  /*$(".post-item").on("click", function() {
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
  });*/
}
