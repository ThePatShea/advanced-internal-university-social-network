Template.postPageBackbone.created = function() {
  Session.set("isLoadingPost", true);
  Session.set("isLoadingComments", true);

  bubbleDep = new Deps.Dependency;

  //Session.set("isLoading", true);
 //var bubble = Bubbles.findOne( Session.get('currentBubbleId') );

  currentBubbleId = window.location.pathname.split("/")[2];
  currentPostId = window.location.pathname.split("/")[4];

  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 1,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
    },

    discussions: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
    },

    files: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
    },

    members: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    admins: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    applicants: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    invitees: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture']
    },

    callback: function(){
      console.log('Bubbledata changed');
      bubbleDep.changed();
      Session.set('isLoading', false);
    }
  });

  currentPostObject = new mybubbles.BubblePost({id: currentPostId});
  currentPostObject.fetch();
  currentPost = currentPostObject.toJSON();
  postAuthorObject = new mybubbles.BubbleUser({id: currentPostObject.toJSON().userId});
  postAuthorObject.fetch();
  postAuthor = postAuthorObject.toJSON();

}

Template.postPageBackbone.rendered = function() {
  var currentUrl     =  window.location.pathname;
  var urlArray       =  currentUrl.split("/");

  //var currentBubbleId  =  urlArray[2];
  //var currentPostId    =  urlArray[4];

  Meteor.subscribe('comments', currentPostId, function() {
    Session.set("isLoadingComments", false);
  });

  if(currentBubbleId != window.location.pathname.split("/")[2])
  {
    console.log('Bubble chenged');
    currentBubbleId = window.location.pathname.split("/")[2];
    currentPostId = window.location.pathname.split("/")[4];

    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId()});
    if(isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
      Meteor.Router.to('bubblePublicPage', bubble._id);
    }

    mybubbles = new BubbleData.MyBubbles({
      bubbleId: currentBubbleId,
      limit: 1,
      fields: ['title', 'profilePicture', 'category', 'bubbleType'],

      events: {
        limit: 1,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
      },

      discussions: {
        limit: 1,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      files: {
        limit: 1,
        fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
      },

      members: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      admins: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      applicants: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      invitees: {
        limit: 1,
        fields: ['username', 'name', 'profilePicture']
      },

      callback: function(){
        console.log('Bubbledata changed');
        bubbleDep.changed();
        Session.set('isLoading', false);
      }
    });

  currentPostObject = new mybubbles.BubblePost({id: currentPostId});
  currentPostObject.fetch();
  currentPost = currentPostObject.toJSON();
  postAuthorObject = new mybubbles.BubbleUser({id: currentPostObject.toJSON().userId});
  postAuthorObject.fetch();
  postAuthor = postAuthorObject.toJSON();

  }

}


Template.postPageBackbone.helpers({
  getCurrentBubbleBackbone: function(){
    var bubble = mybubbles.bubbleInfo.toJSON();
    return bubble;
  },

  getCurrentPostBackbone: function(){
    return currentPostObject.toJSON();
  },

    isFlagged: function() {
      if (this.flagged)
        return true;
      else
        return false;
    }
  , getAuthorProfilePicture: function() {
    bubbleDep.depend();

    var userObject = new mybubbles.BubbleUser({id: this.userId});
    userObject.fetch({async: false});
    var user = userObject.toJSON();
    console.log('Author profile: ', userObject.toJSON());
    return user.profilePicture;
  },

  isLoading: function() {
    if(Session.get("isLoadingPost") && Session.get("isLoadingComments")) {return true};
    return false;
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
    var userObject = new mybubbles.BubbleUser({id: userId});
    userObject.fetch();
    var user = userObject.toJSON();
    //var user = Meteor.users.findOne({_id: userId});
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
      else if(mybubbles.isAdmin(userId)){
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

Template.postPageBackbone.events({
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
