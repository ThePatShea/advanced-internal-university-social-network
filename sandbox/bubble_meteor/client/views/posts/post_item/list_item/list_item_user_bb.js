Template.listItemUserBB.helpers({
    getPostAsUser: function() {
      return this.user;
    },
    getPostAsBubble: function() {
      return this.bubble;
    },
    postedAsUser: function() {
      return this.postAsType === 'user';
    },
    postedAsBubble: function() {
      return this.postAsType === 'bubble';
    },
    displayName: function() {
      if (this.postAsType === 'user') {
        return this.author;
      } else
      if (this.postAsType === 'bubble') {
        if (this.bubble)
          return this.bubble.title;

        // TODO: Fix me?
        return this.author;
      }
    },
    isGoing : function() {
      return _.contains(this.attendees, Meteor.userId());
    },
    hasChildren : function() {
      return typeof this.children !== 'undefined' && this.children !== '';
    },
    membershipCount: function() {
      // TODO: Fix me to use REST
      var currentUserId = this.id;
      if (typeof this.userType != 'undefined'){
        return Bubbles.find({$or: [{'users.members': currentUserId}, {'users.admins': currentUserId}]}).count();
      } else {
        return -1;
      }
    },
    isMe: function() {
      return this.id === Meteor.userId();
    },
    inBubble: function(){
      // TODO: Fix me
      var sitePath = window.location.pathname.split('/')[1];
      return sitePath === 'mybubbles';
    },

    isFile: function() {
      return this.postType === 'file';
    },

    isDiscussion: function() {
      return this.postType === 'discussion';
    },

    isAdminBB: function(){
      return BubbleDataNew.Helpers.isAdmin(Session.get('bubbleInfo'));
    }
});

Template.listItemUserBB.events({
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

Template.listItemUserBB.created = function() {
  mto = "";
};

Template.listItemUserBB.destroyed = function() {
};
