Template.bubbleEventPage.helpers({
  //Get posts assigned to this bubble
  posts: function(){
	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType: 'event', dateTime: {$gt: referenceDateTime}}, {limit: eventListHandle.limit()});
  }
  
});

Template.bubbleEventPage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
        this.eventListHandle.loadNextPage();
    }
  });
}



