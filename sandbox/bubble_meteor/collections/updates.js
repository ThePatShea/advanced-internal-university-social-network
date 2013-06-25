Updates = new Meteor.Collection('updates');

// Updates.allow({
//   update: ownsUpdate
// });

Meteor.methods({
  update: function(updateAttributes){
    var user = Meteor.user()
   
    var update = _.extend(_.pick(updateAttributes, 
      'userId', 'postId', 'commentId', 'bubbleId', 'invokerId',
      'invokerName', 'updateType', 'content', 'url'), {
      submitted: new Date().getTime(),
      read: false
    });
    console.log(updateAttributes.content);
    updateId = Updates.insert(update);
    return updateId;
  },

  setRead: function(update) {
    // Updates.update(update._id, {$set: {read: true}});

    updateList = Updates.find({ read:false, 
                                updateType: update.updateType,
                                bubbleId: update.bubbleId
                              }).fetch();

    if(updateList.length>0) {
      _.each(updateList, function(newUpdate) {
        if(newUpdate.updateType == 'REPLIED' && 
            newUpdate.postId == update.postId){
          //Set read for comments
          Updates.update(newUpdate._id, {$set: {read: true}});
        }else if(newUpdate.invokerId == update.invokerId) {
          //Set read for updates for the same person
          Updates.update(newUpdate._id, {$set: {read: true}});
        }
      });
    }

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
      updateType: "REPLIED",
      url: '/posts/'+post._id,
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
      updateType: "POSTED",
      url: '/posts/'+post._id,
      content: post.author + " added a new post in " + bubble.title + "."
    });
  });
}

//For everyone attending
createEditEventUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var attendees = post.attendees;
  //Remove post owner from list of attendees
  var index = attendees.indexOf(post.author);
  attendees.splice(index,1);

  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: post.userId,
      invokerName: post.author,
      updateType: "EDITED POST",
      url: '/posts/'+post._id,
      content: post.author + " has edited " + post.name
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
    updateType: "REMOVED FROM BUBBLE",
    url: '/bubbles',
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
    updateType: "APPLICATION REJECTED",
      url: '/bubbles',
    content: "Your application has been rejected by " + bubble.title
  });
}

//For everyone attending
createDeleteEventUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);
  var attendees = post.attendees;
  //Remove post owner from list of attendees
  var index = attendees.indexOf(post.author);
  attendees.splice(index,1);

  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: post.userId,
      invokerName: post.author,
      updateType: "EVENT CANCELLED",
      url: '/bubbles/'+bubble._id,
      content: post.author + " has canceled " + post.name
    });
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
      updateType: "INVITATION",
      url: '/bubbles/'+bubble._id,
      content: "You have been invited to join " + bubble.title
    });
  });
}

//For everyone attending
createNewAttendeeUpdate = function(postId) {
  var post = Posts.findOne(postId);
  var bubble = Bubbles.findOne(post.bubbleId);
  var attendees = post.attendees;
  //Remove user from list of attendees
  var index = attendees.indexOf(Meteor.user().username);
  attendees.splice(index,1);

  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "NEW ATTENDEE",
      url: '/bubbles/'+bubble._id+'/members',
      content: Meteor.user().username + " is attending " + post.name
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
      updateType: "JOINED BUBBLE",
      url: '/bubbles/'+bubble._id+'/members',
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
      updateType: "JOINED BUBBLE",
      url: '/bubbles/'+bubble._id+'/members',
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
      updateType: "EDITED BUBBLE",
      url: '/bubbles/'+bubble._id,
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
    updateType: "MEMBER PROMOTED",
      url: '/bubbles/'+bubble._id+'/members',
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
    updateType: "MEMBER DEMOTED",
      url: '/bubbles/'+bubble._id+'/members',
    content: "You have been demoted to a Member"
  });
}

//For admins where there are new applicants
createNewApplicantUpdate = function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));

  _.each(bubble.users.admins, function(adminId){
    Meteor.call('update',{
      userId: adminId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "NEW APPLICANT",
      url: '/bubbles/'+bubble._id+'/members',
      content: chainedNames + " has applied for " + bubble.title
    });
  });
}

