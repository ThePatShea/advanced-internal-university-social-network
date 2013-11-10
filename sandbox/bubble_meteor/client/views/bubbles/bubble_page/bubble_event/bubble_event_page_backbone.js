// Private helpers
// TODO: Fix me. It is not possible to access template instance from template helper in Meteor,
// so we will use global state for now
var state = {
  mybubbles: null
};

// Helpers
function refreshData(bubbleId) {
  Session.set('isLoading', true);

  var mybubbles = state.mybubbles = new BubbleDataNew.MyBubbles({
    bubbleId: bubbleId,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 10,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId'],
      load: true
    },

    callback: function(bubble) {
      Session.set('isLoading', false);

      // TODO: Security check

      if (mybubbles === state.mybubbles) {
        Session.set('bubbleInfo', bubble);
      }
    }
  });
}

// Events
Template.bubbleEventPageBackbone.events({
  'click .pageitem': function(e) {
    Session.set('isLoading',true);
    state.mybubbles.Events.fetchPage(parseInt(e.target.id) - 1, function() {
      Session.set('isLoading', false);
    });
  },
  'click .prev': function() {
    if (state.mybubbles.Events.getCurrentPage() > 0) {
      Session.set('isLoading', true);
      state.mybubbles.Events.fetchPrevPage(function() {
        Session.set('isLoading', false);
      });
    }
  },
  'click .next': function() {
    if (state.mybubbles.Events.getCurrentPage() < state.mybubbles.Events.getNumPages() - 1) {
      Session.set('isLoading', true);
      state.mybubbles.Events.fetchNextPage(function() {
        Session.set('isLoading', false);
      });
    }
  }
});


Template.bubbleEventPageBackbone.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function() {
    if (state.mybubbles)
      return state.mybubbles.Events.getJSON();

    return [];
  },

  postPropertiesBackboneEvent: function() {
    // TODO: Fix me?
    return {
      //'posts': topEventPosts,
      'postType': 'event',
      'word1': 'upcoming'
    };
  },

  getCurrentBubbleBackbone: function(){
    if (state.mybubbles)
      return state.mybubbles.bubbleInfo.toJSON();

    return null;
  },

  pagination: function() {
    if (state.mybubbles)
      return state.mybubbles.Events.getNumPages() > 1;

    return false;
  },

  pages: function() {
    var retVal;

    if (state.mybubbles) {
      retVal = [];

      for (var i = 1; i <= state.mybubbles.Events.getNumPages(); ++i)
        retVal.push(i);
    } else {
      retVal = [1];
    }

    return retVal;
  },

  isActivePage: function() {
    if (state.mybubbles) {
      if (this == state.mybubbles.Events.getCurrentPage() + 1)
        return 'active';
    }

    return '';
  }
});

Template.bubbleEventPageBackbone.created = function(){
  // TODO: Get rid of me
  if (typeof goingDep === "undefined")
    goingDep = new Deps.Dependency();

  this.watch = Meteor.autorun(function() {
    refreshData(Session.get('currentBubbleId'));
  });
};

Template.bubbleEventPageBackbone.destroyed = function() {
  this.watch.stop();
};
