Template.bubbleFilePage.helpers({
  //Get posts assigned to this bubble
  posts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}, {limit: fileListHandle.limit()});
  }
});

Template.bubbleFilePage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
        this.fileListHandle.loadNextPage();
    }
  });
}
