Template.bubbleDiscussionPage.helpers({
  //Get posts assigned to this bubble
  posts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}, {limit: discussionListHandle.limit()});   
  }
});

Template.bubbleDiscussionPage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
        this.discussionListHandle.loadNextPage();
    }
  });
}