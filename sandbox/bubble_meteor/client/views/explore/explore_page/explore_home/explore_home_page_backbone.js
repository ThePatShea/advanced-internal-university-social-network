// Private helpers
function updatePostList(es) {
  Session.set('explorePosts', es.explorePosts.toJSON());
}

function refreshData(template, exploreId) {
  if (!exploreId)
    return;

  Session.set('isExploreLoading', true);

  var es = template.es = new ExploreData.ExploreSection({
    exploreId: exploreId,
    limit: 10,
    fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime', 'children','commentsCount','attendees'],
    // Callbacks
    onInfoLoaded: function(info) {
      Session.set('exploreInfo', info);
    }
  });

  Session.set('isExploreLoading', true);
  es.fetchPage(es.getCurrentPage(), function() {
    updatePostList(es);
    Session.set('isExploreLoading', false);
  });

  $(document).attr('title', 'Explore - Emory Bubble');
};

// Events
Template.explorePageBackbone.events({
  'click .pageitem': function(e, template) {
    Session.set('isExploreLoading', true);
    template.es.fetchPage(parseInt(e.target.id) - 1, function() {
      Session.set('isExploreLoading', false);
      updatePostList(template.es);
    });
  },
  'click .prev': function(e, template) {
    Session.set('isExploreLoading', true);
    template.es.fetchPrevPage(function() {
      Session.set('isExploreLoading', false);
      updatePostList(template.es);
    });
  },
  'click .next': function(e, template) {
    Session.set('isExploreLoading', true);
    template.es.fetchNextPage(function(){
      Session.set('isExploreLoading', false);
      updatePostList(template.es);
    });
  }
});

// Template helpers
Template.explorePageBackbone.helpers({
  posts: function() {
    return Session.get('explorePosts');
  },
  // Pagination stuff
  pagination: function() {
    if (this.es) {
      if (this.es.getNumPages() > 1)
        return true;
    }

    return false;
  },
  pages: function() {
    var retVal = [];

    if (this.es) {
      for (var i = 0; i < this.es.getNumPages(); i++) {
        retVal.push(i + 1);
      }
    } else {
      retVal = [1];
    }
    return retVal;
  },
  isActivePage: function() {
    if (this.es) {
      if (this == this.es.getCurrentPage() + 1) {
        return 'active';
      }
    }
    return '';
  },
  // Explore data
  exploreInfo: function() {
    return Session.get('exploreInfo');
  },
  getExploreId: function() {
    return this.currentExploreId;
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

	this.es = undefined;
	this.currentExploreId = undefined;
  this.watch = Meteor.autorun(function() {
    refreshData(that, Session.get('currentExploreId'));
  });
};


Template.explorePageBackbone.destroyed = function() {
  this.watch.stop();
};
