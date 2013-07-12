Template.bubbleFilePage.helpers({
  //Get posts assigned to this bubble
  getFilePosts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}, {limit: postsListHandle.limit()});
  }
});

Template.bubbleFilePage.rendered = function(){
  postsListHandle._limit = postsListHandle.perPage;
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleFilePage"){
        this.postsListHandle.loadNextPage();
      }
    }
  });
}
