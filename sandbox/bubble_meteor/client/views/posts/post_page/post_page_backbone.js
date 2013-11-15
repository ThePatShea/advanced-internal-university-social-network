Template.postPageBackbone.helpers({
  getCurrentBubbleBackbone: function(){
    return Session.get('currentBubbleInfo');
  },
  getCurrentPostBackbone: function(){
    return Session.get('currentBubblePost');
  },
  isFlagged: function() {
    return this.flagged;
  },
  getAuthorProfilePicture: function() {
    var user = Session.get('currentbubbleUser');
    if (user)
      return user.profilePicture;
  },
  isLoading: function() {
    return Session.get('isLoadingPost') && Session.get('isLoadingComments');
  },
  returnFalse: function() {
    return false;
  },
  notEvent: function(){
    return this.postType !== 'event';
  },
  isEvent: function() {
    return this.postType === 'event';
  },
  isDiscussion: function() {
    return this.postType === 'discussion';
  },
  isFile: function(){
    return this.postType === 'file' && typeof this.parent === 'undefined';
  },
  canDelete: function() {
    var user = Meteor.user();
    var bubble = Session.get('currentBubbleInfo');

    console.log('x', bubble);

    if (this.userId === user._id) {
      console.log('Post Page: Post Author');
      return true;
    } else
    if (BubbleDataNew.Helpers.isAdmin(bubble, user._id)) {
      console.log('Post Page: Bubble Admin');
      return true;
    } else
    if (user.userType == 3) {
      console.log('Post Page: Campus Moderator');
      return true;
    } else {
      return false;
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
  },
  'click .btn-delete': function(e) {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Delete Discussion', this.name]);

    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      //Posts.remove(currentPostId);
      Meteor.call("deletePost",currentPostId);

      //Logs the action that user is doing
      //Meteor.clearTimeout(mto);
      /*mto = Meteor.setTimeout(function() {
        Meteor.call('createLog',
          { action: 'click-postDeleteBtn',
            postId: currentPostId},
          window.location.pathname,
          function(error) { if(error) { throwError(error.reason); }
        });
      }, 500);*/

      var postTitle = $('.post-heading > .name').text();
      var displayPostConfirmationMessage = function(postTitle){
        return function(){
          //postTitle = encodeURIComponent($('.cb-discussionSubmit-form').find('[name=name]').val());
          var message = postTitle.slice(0, 7);
          var message = message + ' ...';
          $('.info').removeClass('visible-false');
          $('.info').text(message);
          $('.job-type').text("deleting");
          $('.message-container').removeClass('visible-false');
          $('.message-container').addClass('message-container-active');
          setTimeout(function(){
            $('.message-container').removeClass('message-container-active');
            $('.message-container').addClass('visible-false');
            clearTimeout();
          },5000);
        };
      };
      console.log('Post Title: ', postTitle);
      setTimeout(displayPostConfirmationMessage(postTitle), 2000);

      Meteor.Router.to('bubblePageBackbone',Session.get('currentBubbleId'));
    }
  }
});

function refreshData(template, bubbleId, currentPostId) {
  if (template.commentSub)
    template.commentSub.stop();

  // Post data
  Session.set('isLoadingPost', true);
  var pageData = template.pageData = new BubbleDataNew.BubblePostPage(bubbleId, currentPostId, function() {
    Session.set('currentBubbleInfo', pageData.getBubble());
    Session.set('currentBubblePost', pageData.getPost());
    Session.set('currentBubbleUser', pageData.getUser());

    Session.set('isLoadingPost', false);
  });

  // Comments
  Session.set('isLoadingComments', true);
  template.commentSub = Meteor.subscribe('comments', currentPostId, function() {
    Session.set('isLoadingComments', false);
  });
}

Template.postPageBackbone.created = function() {
  var that = this;

  Session.set('currentBubblePost', null);
  Session.set('currentBubbleInfo', null);
  Session.set('currentBubbleUser', null);

  this.watch = Meteor.autorun(function() {
    refreshData(that, Session.get('currentBubbleId'), Session.get('currentPostId'));
  });

  if(typeof goingDep === "undefined")
    goingDep = new Deps.Dependency;
}

Template.postPageBackbone.rendered = function() {
  var that = this;

  // Attach custom event handler
  $('#post-page').off('postGoing').on('postGoing', function(e, postId) {
    that.pageData.toggleGoing(Meteor.userId());
    Session.set('currentBubblePost', that.pageData.getPost());
  });
};

Template.postPageBackbone.destroyed = function() {
  if (this.commentSub)
    this.commentSub.stop();

  this.watch.stop();
};
