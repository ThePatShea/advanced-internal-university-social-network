Notifications = new Meteor.Collection('notifications');

Notifications.allow({
  update: ownsDocument
});

//For post owners when comment is created
createCommentNotification = function(comment) {
  var post = Posts.findOne(comment.postId);
  Notifications.insert({
    userId: post.userId,
    postId: post._id,
    commentId: comment._id,
    invokerName: comment.author,
    read: false,
    content: " commented on your post."
  });
};

//For bubble owners when post is created
createPostNotification = function(post) {
  var bubble = Posts.findOne(post.bubbleId);
  Notifications.insert({
    userId: bubble.userId,
    postId: post._id,
    bubbleId: bubble._id,
    invokerName: post.author,
    read: false,
    content: " added a new post in " + bubble.title + "."
  });
};

//For bubble members when bubble is edited
createBubbleNotification = function(bubble) {
  var members = bubble.members;
  for (var i=0; i<members.size(); i++) {
  	Notifications.insert({
	    userId: bubble.userId,
	    bubbleId: bubble._id,
	    invokerName: post.author,
	    read: false,
	    content: bubble.title + " has been edited."
    });
  }
};