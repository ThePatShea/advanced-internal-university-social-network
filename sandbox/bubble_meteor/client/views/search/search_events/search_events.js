Template.searchEvents.helpers({
  hasSearchText: function() {
  	if(Session.get('searchText') != undefined){
  		return true;
  	}
  },
  getSearchedEvents: function() {
  	return Posts.find(
  		{	postType: 'event',
  			$or: [
  			{name: new RegExp(Session.get('searchText'),'i')}, 
  			{body: new RegExp(Session.get('searchText'),'i')},
  			{location: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit: eventListHandle.limit()});
  }
});

Template.searchEvents.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'events');
  
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchEvents'){
        this.eventListHandle.loadNextPage();
      }
    }
  });
}
