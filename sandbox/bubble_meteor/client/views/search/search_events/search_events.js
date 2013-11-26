Template.searchEvents.events({
  'keyup .search-text': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
        if (!err) {
          var events = res;
          Session.set('selectedEventList', events);
        }
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt) {
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchEventsMeteor(searchText, function(err, res) {
      if (!err) {
        var events = res;
        Session.set('selectedEventList', events);
      }
    });
    LoadingHelper.stop();
  }
});



Template.searchEvents.helpers({
  getSearchedEvents: function() {
    return Session.get('selectedEventList');
  },
  typing: function() {
    return Session.get("typing");
  }
});



Template.searchEvents.created = function() {
  Session.set("selectedEventList", []);
}



Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');
  $(document).attr('title', 'Search Events - Emory Bubble');
}

