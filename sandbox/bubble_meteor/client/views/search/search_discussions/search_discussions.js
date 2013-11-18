Template.searchDiscussions.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
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
    SearchHelpers.searchDiscussionsMeteor(searchText, function(err, res) {
      if (!err) {
        var discussionIds = res;
        Session.set('selectedDiscussionIdList', discussionIds);
      }
    });
  }
});



Template.searchDiscussions.helpers({
  getSearchedDiscussions: function() {
    return Posts.find({_id: {$in: Session.get('selectedDiscussionIdList')}},{limit:10});
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

