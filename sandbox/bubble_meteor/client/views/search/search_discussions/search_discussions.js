Template.searchDiscussions.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchDiscussionsREST(searchText, function(err, res) {
        if (!err) {
          console.log('Search DiscussionsREST: ', res);
          var discussions = res;
          Session.set('selectedDiscussionList', discussions);
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
        var discussions = res;
        Session.set('selectedDiscussionList', discussions);
      }
    });
    LoadingHelper.stop();
  }
});



Template.searchDiscussions.helpers({
  getSearchedDiscussions: function() {
    return Session.get('selectedDiscussionList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchDiscussions.created = function() {
  Session.set("selectedDiscussionList", []);
}



Template.searchDiscussions.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'discussions');
  $(document).attr('title', 'Search Discussions - Emory Bubble');
}

