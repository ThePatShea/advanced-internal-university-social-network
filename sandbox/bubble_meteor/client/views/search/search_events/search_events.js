Template.searchEvents.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchEventsREST(searchText, function(err, res) {
        if (!err) {
          var eventIds = res;
          Session.set('selectedEventIdList', eventIds);
        }
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchEventsREST(searchText, function(err, res) {
      if (!err) {
        var eventIds = res;
        Session.set('selectedEventIdList', eventIds);
      }
    });
    LoadingHelper.stop();
  }
});



Template.searchEvents.helpers({
  getSearchedEvents: function() {
    return Session.get('selectedEventIdList');
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

