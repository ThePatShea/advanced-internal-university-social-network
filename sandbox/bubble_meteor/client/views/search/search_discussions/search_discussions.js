Template.searchDiscussions.helpers({
  hasSearchText: function() {
  	if(Session.get('searchText') != undefined){
  		return true;
  	}
  },
  getSearchedDiscussions: function() {
  	return Posts.find(
  		{	postType: 'discussion',
  			$or: [
  			{name: new RegExp(Session.get('searchText'),'i')}, 
  			{body: new RegExp(Session.get('searchText'),'i')}
  			]
  		}, {limit:discussionListHandle.limit()});
  }
});

Template.searchDiscussions.rendered = function(){
  //To set header as active
  Session.set('searchCategory', 'discussions');
  
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == 'searchDiscussions'){
        this.discussionListHandle.loadNextPage();
      }
    }
  });
}
