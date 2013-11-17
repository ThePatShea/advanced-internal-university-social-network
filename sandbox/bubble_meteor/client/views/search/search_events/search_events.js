Template.searchEvents.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    console.log('Search All changed: ', searchText);
    //Session.set('selectedPostIdList', []);
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
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
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var postIds = Session.get('selectedPostIdList');
        postIds.concat(res);
        Session.set('selectedPostIdList', postIds);
      }
    });
  }
});

Template.searchEvents.helpers({
  
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedPostIdList')}},{limit:10});
  },

  typing: function() {
    return Session.get("typing");
  }
});

Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');

  $(document).attr('title', 'Search Events - Emory Bubble');
}

Template.searchEvents.created = function() {
  mto = "";
  Session.set('typing', 'false');
  Session.set("selectedPostIdList", []);
}
