Template.explorePostPage.helpers({
    getPostAsBubbleCategory: function() {
      var bubble = Bubbles.findOne(this.postAsId);
      if (bubble) {
        return bubble.category;
      } else {
        return -1;
      }
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
      console.log("DISPLAY NAME: ", this);
      if (this.postAsType == "user") {
        return this.author;
      } else if (this.postAsType == "bubble") {
        var bubble = Bubbles.findOne(this.postAsId);
        if(typeof bubble != "undefined")
        {
          return bubble.title;
        }
        else
        {
          return this.author;
        }
      }
    },
    isFlagged: function() {
      if (this.flagged)
        return true;
      else
        return false;
    }
  , getAuthorProfilePicture: function() {
    var user = Meteor.users.findOne(this.userId);
    return user && user.profilePicture;
  },

  returnFalse: function() {
    return false;
  },

  notEvent: function(){
    if(this.postType != 'event'){
      return true;
    }
    else{
      return false;
    }
  },

  isEvent: function(){
    if(this.postType == 'event'){
      return true;
    }
    else{
      return false;
    }
  },

  isDiscussion: function(){
    if(this.postType == 'discussion'){
      return true;
    }
    else{
      return false;
    }
  },

  currentExplore: function(){
    return Explores.findOne(Session.get('currentExploreId'));
  }
});

Template.explorePostPage.events({
    'click .btn-flag': function() {
      //Google Analytics
      _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);

      if (confirm("Flagging a post will report it to Bubble moderators as inappropriate. Are you sure you want to flag this post?")) {
        var flagAttributes = {
          postId: this._id,
          bubbleId: this.bubbleId,
          invokerId: Meteor.userId(),
          invokerName: Meteor.user().username,
        }
        Meteor.call('createFlag',flagAttributes);
      }
    }
  , 'click .btn-delete': function(e) {
      //Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Delete Discussion', this.name]);

      e.preventDefault();
      if (confirm("Delete this post?")) {
        var currentPostId = Session.get('currentPostId');
        Posts.remove(currentPostId);
        Meteor.Router.to('explorePage',Session.get('currentExploreId'));
      }
    }
});


Template.explorePostPage.rendered = function(){
  Meteor.subscribe('comments', this._id);
  //Meteor.subscribe('currentExplore', this.exploreId);
  Meteor.subscribe('allExplores');
  Meteor.subscribe('singlePost', this._id);
}

