Template.bubbleDiscussionPage.helpers({
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

