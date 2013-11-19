Template.searchAll.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersREST(searchText, function(err, res) {
        if (!err)
          Session.set('selectedUserIdList', res);
      });
      SearchHelpers.searchBubblesREST(searchText, function(err, res) {
        if (!err)
          Session.set('selectedBubbleIdList', res);
      });
      SearchHelpers.searchFilesREST(searchText, function(err, res) {
        if (!err) {
          var fileIds = res;
          Session.set('selectedFileIdList', fileIds);
        }
      });
      SearchHelpers.searchEventsREST(searchText, function(err, res) {
        if (!err) {
          var eventIds = res;
          Session.set('selectedEventIdList', eventIds);
        }
      });
      SearchHelpers.searchDiscussionsREST(searchText, function(err, res) {
        if (!err) {
          var discussionIds = res;
          Session.set('selectedDiscussionIdList', discussionIds);
        }
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    SearchHelpers.searchUsersREST(searchText, function(err, res) {
      if (!err)
        Session.set('selectedUserIdList', res);
    });
    SearchHelpers.searchBubblesREST(searchText, function(err, res) {
      if (!err)
        Session.set('selectedBubbleIdList', res);
    });
    SearchHelpers.searchFilesREST(searchText, function(err, res) {
      if (!err) {
        var fileIds = res;
        Session.set('selectedFileIdList', fileIds);
      }
    });
    SearchHelpers.searchEventsREST(searchText, function(err, res) {
      if (!err) {
        var eventIds = res;
        Session.set('selectedEventIdList', eventIds);
      }
    });
    SearchHelpers.searchDiscussionsREST(searchText, function(err, res) {
      if (!err) {
        var discussionIds = res;
        Session.set('selectedDiscussionIdList', discussionIds);
      }
    });
  }
});


Template.searchAll.helpers({
  getSearchedFiles: function() {
    return Session.get('selectedFileIdList');
  },
  getSearchedDiscussions: function() {
    return Session.get('selectedDiscussionIdList');
  },
  getSearchedEvents: function() {
    return Session.get('selectedEventIdList');
  },
  getSearchedUsers: function() {
    return Session.get('selectedUserIdList');
  },
  getSearchedBubbles: function() {
    return Session.get('selectedBubbleIdList');
  },
  searching: function() {
    return !!Session.get('searching');
  }
});



Template.searchAll.created = function() {
  Session.set('selectedPostIdList', []);
  Session.set('selectedBubbleIdList', []);
  Session.set('selectedUserIdList', []);
  Session.set('selectedEventIdList', []);
  Session.set('selectedDiscussionIdList', []);
  Session.set('selectedFileIdList', []);
};



Template.searchAll.rendered = function() {
  // To set header as active
  Session.set('searchCategory','all');
  Session.set('currentBubbleId','');

  $(document).attr('title', 'Search - Emory Bubble');
};

