Template.bubbleEventPage.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function(){
	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType: 'event', dateTime: {$gt: moment().add('hours',-4).valueOf()}}, {limit: postsListHandle.limit(), sort: {dateTime: 1} });
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



