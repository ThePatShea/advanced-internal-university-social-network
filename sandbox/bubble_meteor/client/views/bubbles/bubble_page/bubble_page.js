Template.bubblePage.helpers({
  //Get posts assigned to this bubble
  posts: function(){
  	return Posts.find({bubbleId:Session.get('currentBubbleId')});
  },
  isEvent: function() {
  	return this.postType == "event";
  },
  isDiscussion: function() {
    return this.postType == "discussion";
  },
  isFile: function() {
    return this.postType == "file";
  }

});

Template.bubblePage.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      this.postsHandle.loadNextPage();
    }
  });
}