Template.searchBubbles.helpers({
  hasSearchText: function() {
    if(Session.get('searchText') != undefined){
      return true;
    }
  },
  getSearchedBubbles: function() {
  	return Bubbles.find(
  		{	$or: [
  			{title: new RegExp(Session.get('searchText'),'i')}, 
  			{description: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit:mainBubblesHandle.limit()});
  }
});


Template.searchBubbles.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'bubbles');

  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchBubbles'){
        this.mainBubblesHandle.loadNextPage();
      }
    }
  });
}
