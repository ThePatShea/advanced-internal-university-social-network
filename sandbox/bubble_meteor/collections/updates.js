Updates = new Meteor.Collection('updates');

Updates.allow({
  update: ownsDocument
});

//For post owners when comment is created
createCommentUpdate = function(comment) {
  var post = Posts.findOne(comment.postId);
  Updates.insert({
    userId: post.userId,
    postId: post._id,
    commentId: comment._id,
    invokerName: comment.author,
    read: false,
    updateType: "createComment",
    content: " commented on your post."
  });
};

//For bubble owners when post is created
createPostUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  Updates.insert({
    userId: bubble.userId,
    postId: post._id,
    bubbleId: bubble._id,
    invokerName: post.author,
    read: false,
    updateType: "createPost",
    content: " added a new post in " + bubble.title + "."
  });
};

//For bubble members when bubble is edited
createBubbleUpdate = function(bubble) {
  var members = bubble.members;
  if (members) {
	  for (var i=0; i<members.length; i++) {
	  	Updates.insert({
		    userId: members[i],
		    bubbleId: bubble._id,
		    invokerName: bubble.author,
		    read: false,
	    	updateType: "editBubble",
		    content: bubble.title + " has been edited."
	    });
	  }
	}
};