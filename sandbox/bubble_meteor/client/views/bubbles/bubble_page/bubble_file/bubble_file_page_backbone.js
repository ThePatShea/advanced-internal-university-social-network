// Private helpers
// TODO: Fix me. It is not possible to access template instance from template helper in Meteor,
// so we will use global state for now
var state = {
  mybubbles: null
};

// Helpers
function refreshData(bubbleId) {
  LoadingHelper.start();

  var mybubbles = state.mybubbles = new BubbleDataNew.MyBubbles({
    bubbleId: bubbleId,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    files: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId','lastCommentTime','numDownloads'],
      load: true
    },

    callback: function(error, bubble) {
      LoadingHelper.stop();

      // TODO: Security check

      if (mybubbles === state.mybubbles) {
        Session.set('bubbleInfo', bubble);
      }
    }
  });
}

// Events
Template.bubbleFilePageBackbone.events({
  'click .pageitem': function(e) {
    LoadingHelper.start();
    state.mybubbles.Files.fetchPage(parseInt(e.target.id) - 1, function() {
      LoadingHelper.stop();
    });
  },
  'click .prev': function() {
    if (state.mybubbles.Files.getCurrentPage() > 0) {
      LoadingHelper.start();
      state.mybubbles.Files.fetchPrevPage(function() {
        LoadingHelper.stop();
      });
    }
  },
  'click .next': function() {
    if (state.mybubbles.Files.getCurrentPage() < state.mybubbles.Files.getNumPages() - 1) {
      LoadingHelper.start();
      state.mybubbles.Files.fetchNextPage(function() {
        LoadingHelper.stop();
      });
    }
  }
});

// Helpers
Template.bubbleFilePageBackbone.helpers({
  //Get posts assigned to this bubble
  getFilePosts: function() {
    if (state.mybubbles)
      return state.mybubbles.Files.getJSON();

    return [];
  },

  postPropertiesBackboneFile: function() {
    // TODO: Fix me?
    return {
      //'posts': topEventPosts,
      'postType': 'file',
      'word1': 'active'
    };
  },

  getCurrentBubbleBackbone: function(){
    if (state.mybubbles)
      return state.mybubbles.bubbleInfo.toJSON();

    return null;
  },

  pagination: function() {
    if (state.mybubbles)
      return state.mybubbles.Files.getNumPages() > 1;

    return false;
  },

  pages: function() {
    var retVal;

    if (state.mybubbles) {
      retVal = [];

      for (var i = 1; i <= state.mybubbles.Files.getNumPages(); ++i)
        retVal.push(i);
    } else {
      retVal = [1];
    }

    return retVal;
  },

  isActivePage: function() {
    if (state.mybubbles) {
      if (this == state.mybubbles.Files.getCurrentPage() + 1)
        return 'active';
    }

    return '';
  }
});

// Callbacks
Template.bubbleFilePageBackbone.created = function(){
  this.watch = Meteor.autorun(function() {
    refreshData(Session.get('currentBubbleId'));
  });
};

Template.bubbleFilePageBackbone.destroyed = function() {
  this.watch.stop();
};
