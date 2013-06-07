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
    notificationType: "createComment",
    content: " commented on your post."
  });
};

//For bubble owners when post is created
createPostNotification = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  Notifications.insert({
    userId: bubble.userId,
    postId: post._id,
    bubbleId: bubble._id,
    invokerName: post.author,
    read: false,
    notificationType: "createPost",
    content: " added a new post in " + bubble.title + "."
  });
};

//For bubble members when bubble is edited
createBubbleNotification = function(bubble) {
  var members = bubble.members;
  if (members) {
	  for (var i=0; i<members.length; i++) {
	  	Notifications.insert({
		    userId: members[i],
		    bubbleId: bubble._id,
		    invokerName: bubble.author,
		    read: false,
	    	notificationType: "editBubble",
		    content: bubble.title + " has been edited."
	    });
	  }
	}
};