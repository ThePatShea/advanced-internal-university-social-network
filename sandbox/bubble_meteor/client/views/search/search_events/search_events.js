Template.searchEvents.helpers({

  getSearchedEvents: function() {
  	return Posts.find(
  		{	postType: 'event',
  			$or: [
  			{name: new RegExp(Session.get('searchText'),'i')}, 
  			{body: new RegExp(Session.get('searchText'),'i')},
  			{location: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit: searchEventsHandle.limit()});
  }
});

Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');
  
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchEvents'){
        this.searchEventsHandle.loadNextPage();
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
