Template.bubblePage.helpers({
  //Get posts assigned to this bubble
  posts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId')});
  }
});

Template.bubblePage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      this.postsHandle.loadNextPage();
    }
  });
}