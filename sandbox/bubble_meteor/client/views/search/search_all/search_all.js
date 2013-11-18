Template.searchAll.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
        if (!err)
          Session.set('selectedUserIdList', res);
      });
      SearchHelpers.searchBubblesMeteor(searchText, function(err, res) {
        if (!err)
          Session.set('selectedBubbleIdList', res);
      });
      SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
        if (!err) {
          var fileIds = res;
          Session.set('selectedFileIdList', fileIds);
        }
      });
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
        if (!err) {
          var eventIds = res;
          Session.set('selectedEventIdList', eventIds);
        }
      });
      SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
        if (!err) {
          var discussionIds = res;
          Session.set('selectedDiscussionIdList', discussionIds);
        }
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    SearchHelpers.searchUsersMeteor(searchText, function(err, res) {
      if (!err)
        Session.set('selectedUserIdList', res);
    });
    SearchHelpers.searchBubblesMeteor(searchText, function(err, res) {
      if (!err)
        Session.set('selectedBubbleIdList', res);
    });
    SearchHelpers.searchFilesMeteor(searchText, function(err, res) {
      if (!err) {
        var fileIds = res;
        Session.set('selectedFileIdList', fileIds);
      }
    });
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var eventIds = res;
        Session.set('selectedEventIdList', eventIds);
      }
    });
    SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
      if (!err) {
        var discussionIds = res;
        Session.set('selectedDiscussionIdList', discussionIds);
      }
    });
  }
});


Template.searchAll.helpers({
  getSearchedFiles: function() {
    return Posts.find({_id: {$in: Session.get('selectedFileIdList')}, postType: "file"},{limit:3});
  },
  getSearchedDiscussions: function() {
    return Posts.find({_id: {$in: Session.get('selectedDiscussionIdList')}, postType: "discussion"},{limit:3});
  },
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedEventIdList')}, postType: "event"},{limit:3});
  },
  getSearchedUsers: function() {
    return Meteor.users.find({_id: {$in: Session.get('selectedUserIdList')}},{limit:3});
  },
  getSearchedBubbles: function() {
    return Bubbles.find({_id: {$in: Session.get('selectedBubbleIdList')}},{limit:3});
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

