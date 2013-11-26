function stopSubs(template) {
  if (template.singleBubbleSub)
    template.singleBubbleSub.stop();

  if (template.singlePostSub)
    template.singlePostSub.stop();

  if (template.commentsSub)
    template.commentsSub.stop();
}

function refreshData(template, bubbleId, postId) {
  stopSubs(template);

  template.singleBubbleSub = Meteor.subscribe('singleBubble', bubbleId);

  LoadingHelper.start();
  template.subLoading += 1;
  template.singlePostSub = Meteor.subscribe('singlePost', postId, function() {
    LoadingHelper.stop();
    template.subLoading -= 1;
  });

  LoadingHelper.start();
  template.subLoading += 1;
  template.commentsSub = Meteor.subscribe('comments', postId, function() {
    LoadingHelper.stop();
    template.subLoading -= 1;
  });
}

Template.postPage.created = function() {
  this.subLoading = 0;
  var that = this;

  this.watch = Meteor.autorun(function() {
    refreshData(that, Session.get('currentBubbleId'), Session.get('currentPostId'));
  });
};

Template.postPage.destroyed = function() {
  stopSubs(this);

  for (var i = 0; i < this.subLoading; ++i)
    LoadingHelper.stop();

  this.watch.stop();
};

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
