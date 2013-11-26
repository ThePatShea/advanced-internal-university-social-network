Template.searchBubbles.events({
  'keyup .search-text': function(evt){
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    if (!DisplayHelpers.isMobile()) {
      SearchHelpers.searchBubblesMeteor(searchText, function(err, res){
        if (!err)
          Session.set('selectedBubbleList', res);
      });
    }
    LoadingHelper.stop();
  },

  'click .search-btn': function(evt){
    var searchText = $('.search-text').val();
    LoadingHelper.start();
    SearchHelpers.searchBubblesMeteor(searchText, function(err, res){
      if (!err)
        Session.set('selectedBubbleList', res);
    });
    LoadingHelper.stop();
  }
});



Template.searchBubbles.helpers({
  getSearchedBubbles: function() {
    return Session.get('selectedBubbleList');
  },
  typing: function() {
    return Session.get("typing");
  },
});



Template.searchBubbles.created = function() {
  Session.set("selectedBubbleList", []);
}



Template.searchBubbles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'bubbles');
  $(document).attr('title', 'Search Bubbles - Emory Bubble');
}
