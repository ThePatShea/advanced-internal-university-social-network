// Private helpers
function updatePostList(es) {
  Session.set('explorePosts', es.explorePosts.toJSON());
}

// Events
Template.explorePageBackbone.events({
  'click .pageitem': function(e, template) {
    Session.set('isLoading', true);
    template.es.fetchPage(parseInt(e.target.id) - 1, function() {
      Session.set('isLoading', false);
      updatePostList(template.es);
    });
  },
  'click .prev': function(e, template) {
    Session.set('isLoading', true);
    template.es.fetchPrevPage(function() {
      Session.set('isLoading', false);
      updatePostList(template.es);
    });
  },
  'click .next': function(e, template) {
    Session.set('isLoading', true);
    template.es.fetchNextPage(function(){
      Session.set('isLoading', false);
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
  isDiscussion: function(){
    return this.postType === 'discussion';
  }
});

Template.explorePageBackbone.created = function() {
	Session.set('isLoading', true);

	this.es = undefined;
	this.currentExploreId = undefined;
};

Template.explorePageBackbone.rendered = function() {
	if (this.currentExploreId !== window.location.pathname.split('/')[2]) {
		this.currentExploreId = window.location.pathname.split('/')[2];

		var es = this.es = new ExploreData.ExploreSection({
			exploreId: this.currentExploreId,
			limit: 10,
			fields: ['name', 'author', 'postAsType', 'postAsId', 'submitted', 'postType', 'exploreId', 'dateTime', 'children','commentsCount','attendees'],
      // Callbacks
      onInfoLoaded: function(info) {
        console.log('!!!!', info);
        Session.set('exploreInfo', info);
      }
		});

    Session.set('isLoading', true);
		es.fetchPage(es.getCurrentPage(), function() {
      updatePostList(es);
			Session.set('isLoading', false);
		});
	}
	$(document).attr('title', 'Explore - Emory Bubble');
};
