Template.searchDiscussions.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchDiscussionsREST(searchText, function(err, res) {
        if (!err) {
          console.log('Search DiscussionsREST: ', res);
          var discussionIds = res;
          Session.set('selectedDiscussionIdList', discussionIds);
        }
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchDiscussionsREST(searchText, function(err, res) {
      if (!err) {
        var discussionIds = res;
        Session.set('selectedDiscussionIdList', discussionIds);
      }
    });
    LoadingHelper.stop();
  }
});



Template.searchDiscussions.helpers({
  getSearchedDiscussions: function() {
    return Session.get('selectedDiscussionIdList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchDiscussions.created = function() {
  Session.set("selectedDiscussionIdList", []);
}



Template.searchDiscussions.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'discussions');
  $(document).attr('title', 'Search Discussions - Emory Bubble');
}

