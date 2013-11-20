Template.postPage.created = function() {
}

Template.postPage.rendered = function() {
  var currentUrl     =  window.location.pathname;
  var urlArray       =  currentUrl.split("/");

  var currentBubbleId  =  urlArray[2];
  var currentPostId    =  urlArray[4];
  console.log('Updated Post: ', currentBubbleId, currentPostId);
  Session.set('currentBubbleId',currentBubbleId);
  Session.set('currentPost',currentPostId);

  Meteor.subscribe('singleBubble', currentBubbleId);

  LoadingHelper.start();
  Meteor.subscribe('singlePost', currentPostId, function() {
    LoadingHelper.stop();
  });

  LoadingHelper.start();
  Meteor.subscribe('comments', currentPostId, function() {
    LoadingHelper.stop();
  });
}


Template.postPage.helpers({
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

  isFile: function(){
    if(this.postType == 'file' && typeof this.parent == 'undefined'){
      return true;
    }
    else{
      return false;
    }
  },

  canDelete: function(){
    var userId = Meteor.userId();
    var user = Meteor.users.findOne({_id: userId});
    console.log('Post page: ', this.bubbleId);
    var bubble = Bubbles.findOne({_id: this.bubbleId});
    if(typeof bubble.users == 'undefined'){
      return false;
    }
    else{
      var bubbleAdminIds = bubble.users.admins;

      if(this.userId == userId){
        console.log('Post Page: Post Author');
        return true;
      }
      else if(bubbleAdminIds.indexOf(userId) != -1){
        console.log('Post Page: Bubble Admin');
        return true;
      }
      else if(user.userType == 3){
        console.log('Post Page: Campus Moderator');
        return true;
      }
      else{
        return false;
      }
    }
  }
});

Template.postPage.events({
    'click .btn-flag': function() {
      //Google Analytics
      _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);
      var invoker = Meteor.users.findOne(Meteor.userId());

      if (confirm("Flagging a post will report it to Bubble moderators as inappropriate. Are you sure you want to flag this post?")) {
        var flagAttributes = {
          postId: this._id,
          bubbleId: this.bubbleId,
          invokerId: Meteor.userId(),
          invokerName: invoker.username,
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
        Meteor.Router.to('bubblePageBackbone',Session.get('currentBubbleId'));
      }
    }
});
