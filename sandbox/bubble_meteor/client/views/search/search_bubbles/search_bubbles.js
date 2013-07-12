Template.searchBubbles.helpers({
  getSearchedBubbles: function() {
    if(Session.get('searchText')){
      return Bubbles.find(
        { $or: [
          {title: new RegExp(Session.get('searchText'),'i')}, 
          {description: new RegExp(Session.get('searchText'),'i')}
          ]
        }, {limit:searchBubblesHandle.limit()});
    }else{
      return Bubbles.find({}, {limit: mainBubblesHandle.limit()});
    }
  }
});

Template.searchBubbles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'bubbles');

  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchBubbles'){
        if(Session.get('searchText')){
          this.searchBubblesHandle.loadNextPage();
        }else{
          this.mainBubblesHandle.loadNextPage();
        }
      }
    }
  });

  //Set the searchText as session variable
  var searchText = $(".search-text").val();
  if (searchText == ""){
    Session.set('searchText',undefined);
  }else{
    Session.set('searchText', searchText);
  }
}
