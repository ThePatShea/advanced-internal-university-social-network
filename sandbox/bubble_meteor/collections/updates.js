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
    invokerId: comment.userId,
    read: false,
    updateType: "createComment",
    content: " commented on your post."
  });
}

//For bubble owners when post is created
createPostUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var members = bubble.users.members
  var admins = bubble.users.admins

  //Create updates for admins
  for (var i=0; i<admins.length; i++) {
    //Check if user is creating a post in their own bubble
    if (admins[i]._id != post.userId){      
      Updates.insert({
        userId: admins[i],
        postId: post._id,
        bubbleId: bubble._id,
        invokerId: post.userId,
        read: false,
        updateType: "createPost",
        content: " added a new post in " + bubble.title + "."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i]._id != post.userId){      
        Updates.insert({
          userId: members[i],
          postId: post._id,
          bubbleId: bubble._id,
          invokerId: post.userId,
          read: false,
          updateType: "createPost",
          content: " added a new post in " + bubble.title + "."
        });
      }
    }
  }
}

//For bubble members when bubble is edited
createBubbleUpdate = function(bubble) {
  var members = bubble.users.members
  var admins = bubble.users.admins

  //Create updates for admins
  for (var i=0; i<admins.length; i++) {
    //Check if user is creating a post in their own bubble
    if (admins[i]._id != post.userId){      
      Updates.insert({
        userId: admins[i],
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        read: false,
        updateType: "editBubble",
        content: bubble.title + " has been edited."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i]._id != post.userId){      
        Updates.insert({
          userId: members[i],
          bubbleId: bubble._id,
          invokerId: Meteor.userId(),
          read: false,
          updateType: "editBubble",
          content: bubble.title + " has been edited."
        });
      }
    }
  }
}