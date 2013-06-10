Updates = new Meteor.Collection('updates');

Updates.allow({
  update: ownsDocument
});

Meteor.methods({
  update: function(updateAttributes){
    var user = Meteor.user()
   
    var update = _.extend(_.pick(updateAttributes, 'userId', 'postId', 'commentId', 'bubbleId', 'invokerId', 'updateType', 'content'), {
      submitted: new Date().getTime(),
      read: false
    });

    updateId = Updates.insert(update);

    return updateId;
  }

});

//For post owners when comment is created
createCommentUpdate = function(comment) {
  var post = Posts.findOne(comment.postId);
  Meter.call('update',{
    userId: post.userId,
    postId: post._id,
    commentId: comment._id,
    invokerId: comment.userId,
    updateType: "createComment",
    content: comment.author + " commented on your post."
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
      Meteor.call('update',{
        userId: admins[i],
        postId: post._id,
        bubbleId: bubble._id,
        invokerId: post.userId,
        updateType: "createPost",
        content: post.author + " added a new post in " + bubble.title + "."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i]._id != post.userId){      
        Meteor.call('update',{
          userId: members[i],
          postId: post._id,
          bubbleId: bubble._id,
          invokerId: post.userId,
          updateType: "createPost",
          content: post.author + " added a new post in " + bubble.title + "."
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
      Meteor.call('update',{
        userId: admins[i],
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        updateType: "editBubble",
        content: bubble.title + " has been edited."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i]._id != post.userId){      
        Meteor.call('update',{
          userId: members[i],
          bubbleId: bubble._id,
          invokerId: Meteor.userId(),
          updateType: "editBubble",
          content: bubble.title + " has been edited."
        });
      }
    }
  }
}