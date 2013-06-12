Updates = new Meteor.Collection('updates');

Updates.allow({
  update: ownsDocument
});

Meteor.methods({
  update: function(updateAttributes){
    var user = Meteor.user()
   
    var update = _.extend(_.pick(updateAttributes, 
      'userId', 'postId', 'commentId', 'bubbleId', 
      'invokerId', 'invokerName', 'updateType', 'content'), {
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
  if (post.userId != comment.userId){
    Meteor.call('update',{
      userId: post.userId,
      postId: post._id,
      commentId: comment._id,
      bubbleId: post.bubbleId,
      invokerId: comment.userId,
      invokerName: comment.author,
      updateType: "newComment",
      content: comment.author + " commented in a " + post.postType + "."
    });
  }
}

//For bubble admins n members when post is created
createPostUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var members = bubble.users.members
  var admins = bubble.users.admins

  //Create updates for admins
  for (var i=0; i<admins.length; i++) {
    //Check if user is creating a post in their own bubble
    if (admins[i] != post.userId){      
      Meteor.call('update',{
        userId: admins[i],
        postId: post._id,
        bubbleId: bubble._id,
        invokerId: post.userId,
        invokerName: post.author,
        updateType: "newPost",
        content: post.author + " added a new post in " + bubble.title + "."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i] != post.userId){      
        Meteor.call('update',{
          userId: members[i],
          postId: post._id,
          bubbleId: bubble._id,
          invokerId: post.userId,
          invokerName: post.author,
          updateType: "newPost",
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
    if (admins[i] != post.userId){      
      Meteor.call('update',{
        userId: admins[i],
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
        updateType: "newMember",
        content: bubble.title + " has been edited."
      });
    }
  }

  //Create updates for members
  if (members){
    for (var i=0; i<members.length; i++) {
      if (members[i] != post.userId){      
        Meteor.call('update',{
          userId: members[i],
          bubbleId: bubble._id,
          invokerId: Meteor.userId(),
          invokerName: Meteor.user().username,
          updateType: "newMember",
          content: bubble.title + " has been edited."
        });
      }
    }
  }
}