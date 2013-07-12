Template.bubbleDiscussionPage.helpers({
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}, {limit: postsListHandle.limit()});   
  }
});

Template.bubbleDiscussionPage.rendered = function(){
  postsListHandle._limit = postsListHandle.perPage;
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleDiscussionPage"){
        this.postsListHandle.loadNextPage();
      }
    }
  });
}