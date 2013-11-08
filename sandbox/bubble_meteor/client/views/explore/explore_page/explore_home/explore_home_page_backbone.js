// Private helpers
// TODO: Fix me. It is not possible to access template instance from template helper in Meteor,
// so we will use global state for now
var state = {
  es: null
};

function updatePostList() {
  Session.set('explorePosts', state.es.explorePosts.toJSON());
}

function updateLoadingFlag(flag) {
  var count = Deps.nonreactive(function() {
    return Session.get('isExploreLoading');
  });

  Session.set('isExploreLoading', count + flag);
}

function refreshData(template, exploreId) {
  if (!exploreId)
    return;

  if (state.es !== null && state.es.exploreId === exploreId)
    return;

  updateLoadingFlag(1);

  var es = state.es = new ExploreData.ExploreSection({
    exploreId: exploreId,
    limit: 10,
    fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime', 'children','commentsCount','attendees'],
    // Callbacks
    onInfoLoaded: function(info) {
      updateLoadingFlag(-1);

      if (es === state.es)
        Session.set('exploreInfo', info);
    }
  });

  updateLoadingFlag(1);
  es.fetchPage(es.getCurrentPage(), function() {
    updateLoadingFlag(-1);

    if (es === state.es) {
      updatePostList(es);
      Session.set('isExploreLoading', false);
    }
  });

  $(document).attr('title', 'Explore - Emory Bubble');
}

// Events
Template.explorePageBackbone.events({
  'click .pageitem': function(e, template) {
    Session.set('isExploreLoading', true);
    state.es.fetchPage(parseInt(e.target.id) - 1, function() {
      Session.set('isExploreLoading', false);
      updatePostList();
    });
  },
  'click .prev': function(e, template) {
    Session.set('isExploreLoading', true);
    state.es.fetchPrevPage(function() {
      Session.set('isExploreLoading', false);
      updatePostList();
    });
  },
  'click .next': function(e, template) {
    Session.set('isExploreLoading', true);
    state.es.fetchNextPage(function(){
      Session.set('isExploreLoading', false);
      updatePostList();
    });
  }
});

// Template helpers
Template.explorePageBackbone.helpers({
  posts: function() {
    return Session.get('explorePosts');
  },
  // Pagination stuff
  pagination: function(tt, yy) {
    if (state.es) {
      if (state.es.getNumPages() > 1)
        return true;
    }

    return false;
  },
  pages: function() {
    var retVal = [];

    if (state.es) {
      for (var i = 0; i < state.es.getNumPages(); i++) {
        retVal.push(i + 1);
      }
    } else {
      retVal = [1];
    }
    return retVal;
  },
  isActivePage: function() {
    if (state.es) {
      if (this == state.es.getCurrentPage() + 1) {
        return 'active';
      }
    }
    return '';
  },
  // Explore data
  exploreInfo: function() {
    return Session.get('exploreInfo');
  },
  // Various helpers
  isEvent: function() {
    return this.postType === 'event';
  },
  isDiscussion: function() {
    return this.postType === 'discussion';
  },
  isLoading: function() {
    return Session.get('isExploreLoading');
  }
});

Template.explorePageBackbone.created = function() {
  var that = this;

  this.watch = Meteor.autorun(function() {
    refreshData(that, Session.get('currentExploreId'));
  });
};


Template.explorePageBackbone.destroyed = function() {
  this.watch.stop();
};
