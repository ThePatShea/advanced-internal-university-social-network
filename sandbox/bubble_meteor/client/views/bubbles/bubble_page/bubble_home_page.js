Template.bubbleHomePage.helpers({
  //Get posts assigned to this bubble
  eventsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event'}).count() - 3;
  },
  discussionsCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'}).count() - 3;
  },
  filesCount: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'}).count() - 3;
  },

  eventPosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'event'},{limit: 3});
  },
  discussionPosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'discussion'},{limit: 3});
  },
  filePosts: function() {
    return Posts.find({bubbleId:Session.get('currentBubbleId'), postType:'file'},{limit: 3});
  }
  
});
