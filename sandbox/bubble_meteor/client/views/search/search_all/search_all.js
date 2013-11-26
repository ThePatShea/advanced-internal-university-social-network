Template.searchAll.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
        if (!err) {
          var threeUsers = res.slice(0,3);
          Session.set('selectedUserList', threeUsers);
        }
      });
      SearchHelpers.searchBubblesMeteor(searchText, function(err, res) {
        if (!err) {
          var threeBubbles = res.slice(0,3);
          Session.set('selectedBubbleList', threeBubbles);
        }
      });
      SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
        if (!err) {
          var threeFiles = res.slice(0,3);
          Session.set('selectedFileList', threeFiles);
        }
      });
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
        if (!err) {
          var threeEvents = res.slice(0,3);
          Session.set('selectedEventList', threeEvents);
        }
      });
      SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
        if (!err) {
          var threeDiscussions = res.slice(0,3);
          Session.set('selectedDiscussionList', threeDiscussions);
        }
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
      if (!err) {
        var threeUsers = res.slice(0,3);
        Session.set('selectedUserList', threeUsers);
      }
    });
    SearchHelpers.searchBubblesMeteor(searchText, function(err, res) {
      if (!err) {
        var threeBubbles = res.slice(0,3);
        Session.set('selectedBubbleList', threeBubbles);
      }
    });
    SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
      if (!err) {
        var threeFiles = res.slice(0,3);
        Session.set('selectedFileList', threeFiles);
      }
    });
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var threeEvents = res.slice(0,3);
        Session.set('selectedEventList', threeEvents);
      }
    });
    SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
      if (!err) {
        var threeDiscussions = res.slice(0,3);
        Session.set('selectedDiscussionList', threeDiscussions);
      }
    });
    LoadingHelper.stop();
  }
});


Template.searchAll.helpers({
  getSearchedFiles: function() {
    return Session.get('selectedFileList');
  },
  getSearchedDiscussions: function() {
    return Session.get('selectedDiscussionList');
  },
  getSearchedEvents: function() {
    return Session.get('selectedEventList');
  },
  getSearchedUsers: function() {
    return Session.get('selectedUserList');
  },
  getSearchedBubbles: function() {
    return Session.get('selectedBubbleList');
  },
  searching: function() {
    return !!Session.get('searching');
  }
});



Template.searchAll.created = function() {
  Session.set('selectedPostList', []);
  Session.set('selectedBubbleList', []);
  Session.set('selectedUserList', []);
  Session.set('selectedEventList', []);
  Session.set('selectedDiscussionList', []);
  Session.set('selectedFileList', []);
};



Template.searchAll.rendered = function() {
  // To set header as active
  Session.set('searchCategory','all');
  Session.set('currentBubbleId','');

  $(document).attr('title', 'Search - Emory Bubble');
};

