Updates = new Meteor.Collection('updates');

Updates.allow({
  update: ownsUpdate
});

Meteor.methods({
  update: function(updateAttributes){
    var user = Meteor.user();
   
    var update = _.extend(_.pick(updateAttributes, 
      'userId', 'postId', 'commentId', 'bubbleId', 'invokerId',
      'invokerName', 'updateType', 'content', 'url'), {
      submitted: new Date().getTime(),
      read: false,
      emailed: false
    });
    var updateId = Updates.insert(update);
    return updateId;
  },

  setRead: function(update) {

    //Clears the list of collapsed updates
    updateList = Updates.find({ userId: update.userId,
                                read:false, 
                                updateType: update.updateType,
                                bubbleId: update.bubbleId,
                                postId: update.postId
                              }).fetch();
    if(updateList.length>0) {
      _.each(updateList, function(newUpdate) {
        Updates.update({_id:newUpdate._id, read:false}, {$set: {read: true}});
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
      updateType: "replied",
      url: '/mybubbles/'+bubble._id+'/posts/'+post._id,
      content: " commented on " + post.name
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
      updateType: "posted",
      url: '/mybubbles/'+bubble._id+'/posts/'+post._id,
      content: post.author + " created a new " + post.postType + " in " + bubble.title
    });
  });
}

//For everyone attending
createEditEventUpdate = function(userId, postId) {
  //Removes previous updates that shows post is edited
  var oldUpdates = Updates.find({read: false, postId: postId, updateType: 'edited post'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  var post = Posts.findOne(postId);
  var bubble = Bubbles.findOne(post.bubbleId);
  var attendees = post.attendees;
  //Remove post owner from list of attendees
  var index = attendees.indexOf(Meteor.users.findOne(userId).username);
  if(index>0){
    attendees.splice(index,1);
  }
  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "edited post",
      url: '/mybubbles/'+bubble._id+'/posts/'+post._id,
      content: Meteor.user().username + " edited " + post.name
    });
  });
}

//For users who are removed from bubble
createRemoveMemberUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));

  //Clears all other user specific updates
  var oldUpdates = Updates.find({
    read: false, 
    bubbleId: bubble._id,
    $or: [
      {userId: userId},
      {invokerId:userId, updateType: 'entered bubble'},
      {invokerId:userId, updateType: 'joined bubble'}
    ] 
  }).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "removed from bubble",
    url: '/searchAll',
    content: "You have been removed from " + bubble.title
  });
}

//For users who are rejected by bubble
createRejectApplicationUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "application rejected",
    url: '/searchAll',
    content: bubble.title + " rejected your application"
  });
}

//For everyone attending
createDeleteEventUpdate = function(post) {
  var bubble = Bubbles.findOne(post.bubbleId);

  //Clears post related update when user has deleted post
  newApplicantList = Updates.find({read: false, postId: post.postId}).fetch();
  
  _.each(newApplicantList, function(update) {
    Meteor.call('setRead', update);
  });

  //Remove post owner from list of attendees
  var attendees = post.attendees;
  var index = attendees.indexOf(Meteor.user().username);
  attendees.splice(index,1);

  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "event cancelled",
      url: '/mybubbles/'+bubble._id+"/home",
      content: Meteor.user().username + " canceled the event " + post.name
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
      updateType: "invitation",
      url: '/mybubbles/'+bubble._id+"/home",
      content: Meteor.user().username + " invited you to " + bubble.title
    });
  });
}

//For everyone attending
createNewAttendeeUpdate = function(postId) {
  var post = Posts.findOne(postId);
  var bubble = Bubbles.findOne(post.bubbleId);

  //Clears multiple attendee updates
  var oldUpdates = Updates.find({read: false, userId: Meteor.userId(), bubbleId: bubble._id, updateType: 'new attendee'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  //Remove user from list of attendees
  var attendees = post.attendees;
  var index = attendees.indexOf( Meteor.userId() );
  attendees.splice(index,1);

  _.each(attendees, function(userId){
    var user = Meteor.users.findOne(userId);
    Meteor.call('update',{
      userId: user._id,
      postId: postId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "new attendee",
      url: '/mybubbles/'+bubble._id+'/members',
      content: " is attending " + post.name
    });
  });
}

//For bubble members when a member is added
createNewMemberUpdate = function(userId, bubbleId) {
  var bubble;
  if(bubbleId) {
    bubble = Bubbles.findOne(bubbleId);
  }else{
    bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  }

  //Clears all other updates when user has joined bubble
  var oldUpdates = Updates.find({read: false, bubbleId: bubble._id, $or:[{userId: userId}, {invokerId: userId}]}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  //Removes users who are not receiving updates
  var everyone = getEveryone(bubble);
  var index = everyone.indexOf(Meteor.userId());
  everyone.splice(index,1);
  index = everyone.indexOf(userId);
  everyone.splice(index,1);
  var user = Meteor.users.findOne(userId);

  // This shows that admin has accepted an application and
  // an update needs to be sent to the newly added member
  Meteor.call('update',{
    userId: user._id,
    bubbleId: bubble._id,
    invokerId: user._id,
    invokerName: user.username,
    updateType: "entered bubble",
    url: '/mybubbles/'+bubble._id+'/members',
    content: "Congratulations! You Are now part of " + bubble.title 
  });

  //Sends an update to everyone who is not the new member 
  //nor the admin who accepted the member
  _.each(everyone, function(memberId){
    Meteor.call('update',{
      userId: memberId,
      bubbleId: bubble._id,
      invokerId: userId,
      invokerName: user.username,
      updateType: "joined bubble",
      url: '/mybubbles/'+bubble._id+'/members',
      content: user.username + " joined " + bubble.title
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
      updateType: "edited bubble",
      url: '/mybubbles/'+bubble._id+"/home",
      content: Meteor.user().username + " edited the bubble " + bubble.title
    });
  });
}

//For bubble admins who were just promoted
createMemberPromoteUpdate = function(userId) { 
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, userId: userId, bubbleId: bubble._id, updateType: 'member demoted'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "member promoted",
      url: '/mybubbles/'+bubble._id+'/members',
    content: Meteor.user().username + " promoted you to admin of the bubble " + bubble.title
  });
}

//For bubble members who were just demoted
createAdminDemoteUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, userId: userId, bubbleId: bubble._id, updateType: 'member promoted'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "member demoted",
      url: '/mybubbles/'+bubble._id+'/members',
    content: Meteor.user().username + " demoted you to member of the bubble " + bubble.title
  });
}

//For admins where there are new applicants
createNewApplicantUpdate = function() {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, invokerId: Meteor.userId(), bubbleId: bubble._id, updateType: 'new applicant'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  _.each(bubble.users.admins, function(adminId){
    Meteor.call('update',{
      userId: adminId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "new applicant",
      url: '/mybubbles/'+bubble._id+'/members',
      content: " applied to be a member of the bubble " + bubble.title
    });
  });
}

//For super users when there are new flags
createPostFlagUpdate = function(flag) {
  var post = Posts.findOne(flag.postId);

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, postId: post._id, updateType: 'post unflagged'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  var superUsers = Meteor.users.find({userType:'superuser'}).fetch();
  _.each(superUsers, function(user) {
    if(user._id != Meteor.userId()){
      Meteor.call('update',{
        userId: user._id,
        bubbleId: flag.bubbleId,
        postId: flag.postId,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
        updateType: "post flagged",
        url: '/mybubbles/'+flag.bubbleId+'/posts/'+flag.postId,
        content: post.name + " has been flagged"
      });
    }
  }); 
}

//For super users when there are new flags
createPostUnflagUpdate = function(flag) {
  var post = Posts.findOne(flag.postId);

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, postId: post._id, updateType: 'post flagged'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  var superUsers = Meteor.users.find({userType:'superuser'}).fetch();
  _.each(superUsers, function(user) {
    if(user._id != Meteor.userId()){
      Meteor.call('update',{
        userId: user._id,
        bubbleId: flag.bubbleId,
        postId: flag.postId,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
        updateType: "post unflagged",
        url: '/mybubbles/'+flag.bubbleId+'/posts/'+flag.postId,
        content: post.name + " has been unflagged"
      });
    }
  }); 
}

