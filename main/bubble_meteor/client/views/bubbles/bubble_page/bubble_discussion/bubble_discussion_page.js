Template.bubbleDiscussionPage.helpers({
  //Get posts assigned to this bubble
  getDiscussionPosts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}, {limit: discussionsHandle.limit(), sort: {lastCommentTime:  -1} });   
  }
});

Template.bubbleDiscussionPage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      if(Meteor.Router._page == "bubbleDiscussionPage"){
        this.discussionsHandle.loadNextPage();
      }
    }
  });
}
