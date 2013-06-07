Template.bubblePage.helpers({
  currentBubble: function() {
    return Bubbles.findOne(Session.get('currentBubbleId'));
  },
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