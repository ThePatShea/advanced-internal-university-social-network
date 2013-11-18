Template.searchEvents.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
        if (!err) {
          var eventIds = res;
          Session.set('selectedEventIdList', eventIds);
        }
      });
    }
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var eventIds = res;
        Session.set('selectedEventIdList', eventIds);
      }
    });
  }
});



Template.searchEvents.helpers({
  getSearchedEvents: function() {
    return Posts.find({_id: {$in: Session.get('selectedEventIdList')}},{limit:10});
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchEvents.created = function() {
  Session.set("selectedEventIdList", []);
}



Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');
  $(document).attr('title', 'Search Events - Emory Bubble');
}

