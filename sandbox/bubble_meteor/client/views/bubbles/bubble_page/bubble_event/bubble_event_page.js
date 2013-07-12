Template.bubbleEventPage.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function(){
	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType: 'event', dateTime: {$gt: referenceDateTime}}, {limit: postsListHandle.limit()});
  }
  
});

Template.bubbleEventPage.rendered = function(){
  postsListHandle._limit = postsListHandle.perPage;
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleEventPage"){
        this.postsListHandle.loadNextPage();
      }
    }
  });
}



