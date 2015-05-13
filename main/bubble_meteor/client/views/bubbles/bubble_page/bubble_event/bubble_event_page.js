Template.bubbleEventPage.helpers({
  //Get posts assigned to this bubble
  getEventPosts: function(){
	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType: 'event', dateTime: {$gt: moment().add('hours',-4).valueOf()}}, {limit: eventsHandle.limit(), sort: {dateTime: 1} });
  }
  
});

Template.bubbleEventPage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleEventPage"){
        this.discussionsHandle.loadNextPage();
      }
    }
  });
}



