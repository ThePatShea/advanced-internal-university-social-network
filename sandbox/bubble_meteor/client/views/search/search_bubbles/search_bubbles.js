Template.searchBubbles.events({
  'keyup .search-text': function(evt){
    var searchText = $('.search-text').val();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchBubblesREST(searchText, function(err, res){
        if (!err)
          Session.set('selectedBubbleIdList', res);
      });
    }
  },

  'click .search-btn': function(evt){
    var searchText = $('.search-text').val();
    SearchHelpers.searchBubblesREST(searchText, function(err, res){
      if (!err)
        Session.set('selectedBubbleIdList', res);
    });
  }
});



Template.searchBubbles.helpers({
  getSearchedBubbles: function() {
    return Session.get('selectedBubbleIdList');
  },
  typing: function() {
    return Session.get("typing");
  },
});



Template.searchBubbles.created = function() {
  Session.set("selectedBubbleIdList", []);
}



Template.searchBubbles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'bubbles');
  $(document).attr('title', 'Search Bubbles - Emory Bubble');
}
