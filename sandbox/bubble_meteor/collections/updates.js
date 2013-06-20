Updates = new Meteor.Collection('updates');

// Updates.allow({
//   update: ownsUpdate
// });

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
  },

  setRead: function(updatesList){
    _.each(updatesList, function(update){
      Updates.update(update._id, {$set: {read: true}});
    });
    return true;
  }
});

getEveryone = function(bubble){
  return bubble.users.admins.concat(bubble.users.members);
}

//For post owners when comment is created
createCommentUpdate = function(comment) {
  var post = Posts.findOne(comment.postId);
  var bubble = Bubbles.findOne(post.bubbleId);
  var everyone = getEveryone(bubble);

  for (var i=0; i<everyone.length; i++) {
    if (everyone[i] != comment.userId){
      Meteor.call('update',{
        userId: everyone[i],
        postId: post._id,
        commentId: comment._id,
        bubbleId: post.bubbleId,
        invokerId: comment.userId,
        invokerName: comment.author,
        updateType: "newComment",
        content: comment.author + " commented in a " + post.postType + "."
      });
      console.log("this ran");
    }
  }
}

//For bubble admins n members when post is created
createPostUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var everyone = getEveryone(bubble);

  for (var i=0; i<everyone.length; i++) {    
    if (everyone[i] != post.userId) {
      Meteor.call('update',{
        userId: everyone[i],
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

//For bubble members when a member is added
createNewMemberUpdate = function(bubble) {
  var everyone = getEveryone(bubble);

  for (var i=0; i<everyone.length; i++) {
    if (everyone[i] != Meteor.userId()){      
      Meteor.call('update',{
        userId: everyone[i],
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
        updateType: "newMember",
        content: bubble.title + " has been edited."
      });
    }
  }
}

//For bubble members when a bubble is edited
createBubbleEditUpdate = function(bubble) {
  var everyone = getEveryone(bubble);

  for (var i=0; i<everyone.length; i++) {
    if (everyone[i] != Meteor.userId()){      
      Meteor.call('update',{
        userId: everyone[i],
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
        updateType: "newMember",
        content: bubble.title + " has been edited."
      });
    }
  }
}