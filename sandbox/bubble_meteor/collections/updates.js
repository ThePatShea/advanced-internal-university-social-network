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
  var index = everyone.indexOf(comment.userId);
  everyone.splice(index,1);

  _.each(everyone, function(userId) {
    Meteor.call('update',{
      userId: userId,
      postId: post._id,
      commentId: comment._id,
      bubbleId: post.bubbleId,
      invokerId: comment.userId,
      invokerName: comment.author,
      updateType: "newComment",
      content: comment.author + " commented in a " + post.postType + "."
    });
  });
}

//For bubble admins n members when post is created
createPostUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var everyone = getEveryone(bubble);
  var index = everyone.indexOf(post.userId);
  everyone.splice(index,1);

  _.each(everyone, function(userId) {
    Meteor.call('update',{
      userId: userId,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: post.userId,
      invokerName: post.author,
      updateType: "newPost",
      content: post.author + " added a new post in " + bubble.title + "."
    });
  });
}

//For bubble members when a member is added
createNewMemberUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  var everyone = getEveryone(bubble);
  var index = everyone.indexOf(Meteor.userId());
  everyone.splice(index,1);
  index = everyone.indexOf(userId);
  everyone.splice(index,1);

  // This shows that admin has accepted an application and
  // an update needs to be sent to the newly added member
  if(userId != Meteor.userId()){
    Meteor.call('update',{
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "joinedBubble",
      content: "Congratulations, you have just joined " + bubble.title
    });
  }

  //Sends an update to everyone who is not the new member 
  //nor the admin who accepted the member
  _.each(everyone, function(memberId){
    Meteor.call('update',{
      userId: memberId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "newMember",
      content: Meteor.users.findOne(userId).username + " has joined " + bubble.title
    });
  });
}

//For bubble members when a bubble is edited
createBubbleEditUpdate = function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  var everyone = getEveryone(bubble);
  var index = everyone.indexOf(Meteor.userId());
  everyone.splice(index,1);

  _.each(everyone, function(userId){  
    Meteor.call('update',{
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "editBubble",
      content: bubble.title + " Bubble has been edited."
    });
  });
}

//For bubble admins who were just promoted
createMemberPromoteUpdate = function(userId) {
  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "promoteMember",
    content: "You have been promoted to an Admin"
  });
}

//For bubble members who were just demoted
createAdminDemoteUpdate = function(userId) {
  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "demoteAdmin",
    content: "You have been demoted to a Member"
  });
}

//For users who have received an invitation
createInvitationUpdate = function(userList) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  _.each(userList, function(userId){
    Meteor.call('update',{
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "inviteUser",
      content: "You have been invited to join " + bubble.title
    });
  });
}

//For users who are removed from bubble
createRemoveMemberUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "removeMember",
    content: "You have been removed from " + bubble.title
  });
}

//For users who are removed from bubble
createRejectApplicationUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "rejectApplication",
    content: "Your application has been rejected by " + bubble.title
  });
}

//For users who are removed from bubble
createNewApplicantUpdate = function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  _.each(bubble.users.admins, function(adminId){
    Meteor.call('update',{
      userId: adminId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "rejectApplication",
      content: Meteor.user().username + " has applied for " + bubble.title
    });
  });
}

