// Private helpers
// TODO: Fix me. It is not possible to access template instance from template helper in Meteor,
// so we will use global state for now
var state = {
  mybubbles: null
};

function refreshData(bubbleId) {
  LoadingHelper.start();

  // TODO: This security check will never work
  var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + bubbleId + '&userid=' + Meteor.userId()});
  var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + bubbleId + '&userid=' + Meteor.userId()});
  if (isMemberAjax.responseText == 'False' && isAdminAjax.responseText == 'False'){
    Meteor.Router.to('bubblePublicPage', bubble._id);
  }

  var mybubbles = state.mybubbles = new BubbleDataNew.MyBubbles({
    bubbleId: bubbleId,
    limit: 3,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId','location'],
      load: true
    },

    discussions: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId','lastCommentTime'],
      load: true
    },

    files: {
      limit: 3,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId','lastCommentTime','numDownloads'],
      load: true
    },

    /*
    members: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    admins: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    applicants: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    invitees: {
      limit: 0,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },
    */

    callback: function(error, bubble) {
      LoadingHelper.stop();

      if (mybubbles === state.mybubbles) {
        Session.set('bubbleInfo', bubble);
      }
    }
  });
}

function refreshUpdates(bubbleId) {
  LoadingHelper.start();

  var opts = {
    limit: Session.get('bubbleUpdatesToShow'),
    query: {
      bubbleId: bubbleId
    }
  };

  UpdatesHelper.getUpdates(opts, function(result) {
    Session.set('bubbleUpdateCount', result.count);
    Session.set('bubbleUpdates', result.updates);

    LoadingHelper.stop();
  });
}

// Helpers
Template.bubblePageBackbone.helpers({
  // Bubble info
  getCurrentBubbleBackbone: function(){
    return Session.get('bubbleInfo');
  },
  // Counts
  eventsCount: function() {
    return state.mybubbles.Events.getCount();
  },
  discussionsCount: function() {
    return state.mybubbles.Discussions.getCount();
  },
  filesCount: function() {
    return state.mybubbles.Files.getCount();
  },

  // check if there are more posts to view
  hasMoreEvents: function() {
    var count = state.mybubbles.Events.getCount();
    return count > 3;
  },
  numMoreEvents: function(){
    var count = state.mybubbles.Events.getCount();
    return count - 3;
  },

  hasMoreDiscussions: function() {
    var count = state.mybubbles.Discussions.getCount();
    return count > 3;
  },
  numMoreDiscussionsCount: function(){
    var count = state.mybubbles.Discussions.getCount();
    return count - 3;
  },

  hasMoreFiles: function() {
    var count = state.mybubbles.Files.getCount();
    return count > 3;
  },

  // Updates
  getUpdateCount: function() {
    return Session.get('bubbleUpdateCount');
  },

  getUpdates: function() {
    return Session.get("bubbleUpdates");
  },

  haveMoreUpdates: function() {
    var updateCount = Session.get('bubbleUpdateCount');
    var toShow = Session.get('bubbleUpdatesToShow');
    return toShow !== 0 && updateCount > toShow;
  },

  showUpdates: function() {
    return Session.get('bubbleUpdateCount') > 0;
  },

  // Post-type helpers
  postPropertiesBackboneEvent: function(){
    return {
      'posts': state.mybubbles.Events.getJSON(),
      'postType': 'event',
      'word1': 'upcoming'
    };
  },

  postPropertiesBackboneDiscussion: function(){
    return {
      'posts': state.mybubbles.Discussions.getJSON(),
      'postType': 'discussion',
      'word1': 'active'
    };
  },

  postPropertiesBackboneFile: function(){
    return {
      'posts': state.mybubbles.Files.getJSON(),
      'postType': 'file',
      'word1': 'latest'
    };
  },

  filePosts: function() {
    var filePosts = state.mybubbles.getFiles();
    return filePosts;
  }
});

Template.bubblePageBackbone.events({
  'click .clear-updates': function() {
    var currentBubbleId = Session.get('currentBubbleId');
    var updates = Updates.find({bubbleId: currentBubbleId, userId: Meteor.userId(), read:false}).fetch();
    _.each(updates, function(update) {
      Meteor.call('setRead', update);
    });
  },

  'click .more-updates': function() {
    Session.set('bubbleUpdatesToShow', 0);
  }
});


Template.bubblePageBackbone.created = function() {
  var that = this;

  Session.set('bubbleUpdatesToShow', 3);

  this.updatedPosts = Meteor.subscribe('updatedPosts', Meteor.userId());

  // TODO: Fix me
  if (typeof goingDep === "undefined")
    goingDep = new Deps.Dependency;

  this.watch = Meteor.autorun(function() {
    refreshData(Session.get('currentBubbleId'));
  });

  this.updatesWatch = Meteor.autorun(function() {
    refreshUpdates(Session.get('currentBubbleId'));
  });
};

Template.bubblePageBackbone.rendered = function() {
  $(document).attr('title', 'My Bubbles - Emory Bubble');
};

Template.bubblePageBackbone.destroyed = function() {
  this.watch.stop();
  this.updatesWatch.stop();
  this.updatedPosts.stop();
};
