Template.searchAll.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    console.log('Search All changed: ', searchText);
    //Session.set('selectedPostIdList', []);
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
          var postIds = Session.get('selectedPostIdList') || [];
          postIds = postIds.concat(res);
          Session.set('selectedPostIdList', postIds);
        }
      });
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
        if (!err) {
          var postIds = Session.get('selectedPostIdList') || [];
          postIds = postIds.concat(res);
          Session.set('selectedPostIdList', postIds);
        }
      });
      SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
        if (!err) {
          var postIds = Session.get('selectedPostIdList') || [];
          postIds = postIds.concat(res);
          Session.set('selectedPostIdList', postIds);
        }
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    console.log('Search All button Click: ', searchText);
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
        var postIds = Session.get('selectedPostIdList');
        postIds.concat(res);
        Session.set('selectedPostIdList', postIds);
      }
    });
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var postIds = Session.get('selectedPostIdList');
        postIds.concat(res);
        Session.set('selectedPostIdList', postIds);
      }
    });
    SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
      if (!err) {
        var postIds = Session.get('selectedPostIdList');
        postIds.concat(res);
        Session.set('selectedPostIdList', postIds);
      }
    });
  }
});


Template.searchAll.helpers({
  getSearchedFiles: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "file"},{limit:3});
  },
  getSearchedDiscussions: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "discussion"},{limit:3});
  },
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}, postType: "event"},{limit:3});
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

Template.searchAll.rendered = function() {
  // To set header as active
  Session.set('searchCategory','all');
  Session.set('currentBubbleId','');

  $(document).attr('title', 'Search - Emory Bubble');
};



Template.searchAll.created = function() {
  //mto = "";
  //Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
  Session.set("selectedBubbleIdList", []);
  Session.set("selectedUserIdList", []);
  //var tmp = [];
};
