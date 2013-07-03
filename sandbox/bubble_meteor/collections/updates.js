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
    updateId = Updates.insert(update);
    return updateId;
  },

  setRead: function(update) {

    //Clears the list of collapsed updates
    updateList = Updates.find({ userId: Meteor.userId(),
                                read:false, 
                                updateType: update.updateType,
                                bubbleId: update.bubbleId
                              }).fetch();

    if(updateList.length>0) {
      _.each(updateList, function(newUpdate) {
        if(newUpdate.updateType == 'REPLIED' && 
            newUpdate.postId == update.postId) {
          //Set read for comments
          Updates.update({_id:newUpdate._id,read:false}, {$set: {read: true}});
        }else if(newUpdate.invokerId == update.invokerId) {
          //Set read for updates for the same person
          Updates.update({_id:newUpdate._id,read:false}, {$set: {read: true}});
        }else if((newUpdate.updateType == "NEW APPLICANT" ||
                  newUpdate.updateType == "INVITATION" ||
                  newUpdate.updateType == "MEMBER DEMOTED" ||
                  newUpdate.updateType == "MEMBER PROMOTED" ||
                  newUpdate.updateType == "JOINED BUBBLE" ||
                  newUpdate.updateType == "EDITED BUBBLE") &&
                  update.updateType == newUpdate.updateType &&
                  update.bubbleId == newUpdate.bubbleId) {
          //Set read for bubble related collapsed updates
          Updates.update({_id:newUpdate._id,read:false}, {$set: {read: true}});
        }else if((newUpdate.updateType == "EDITED POST" ||
                  newUpdate.updateType == "NEW ATTENDEE" ) &&
                  update.updateType == newUpdate.updateType &&
                  update.postId == newUpdate.postId) {
          //Set read for post related collapsed updates
          Updates.update({_id:newUpdate._id,read:false}, {$set: {read: true}});
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
      url: '/mybubbles'+bubble._id+'/posts/'+post._id,
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
      updateType: "POSTED",
      url: '/mybubbles'+bubble._id+'/posts/'+post._id,
      content: post.author + " created a new " + post.postType + " in " + bubble.title
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
      url: '/mybubbles'+bubble._id+'/posts/'+post._id,
      content: post.author + " edited " + post.name
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
    url: '/searchAll',
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
    url: '/searchAll',
    content: bubble.title + " rejected your application"
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
      url: '/mybubbles/'+bubble._id+"/home",
      content: post.author + " canceled the event " + post.name
    });
  });

  //Clears update when user has deleted post
  newApplicantList = Updates.find({ 
    postId: post.postId, 
    $or:[{
      updateType: "POSTED"},
      {updateType:"EDITED POST"},
      {updateType:"REPLIED"}
      ]}).fetch();
  
  _.each(newApplicantList, function(update) {
    Meteor.call('setRead', update);
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
      url: '/mybubbles/'+bubble._id+"/home",
      content: Meteor.user().username + " invited to the bubble " + bubble.title
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
      url: '/mybubbles/'+bubble._id+'/members',
      content: " is attending " + post.name
    });
  });
}

//For bubble members when a member is added
createNewMemberUpdate = function(userId,bubbleId) {
  var bubble;
  if(bubbleId) {
    bubble = Bubbles.findOne(bubbleId);
  }else{
    bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  }
  var everyone = getEveryone(bubble);
  var index = everyone.indexOf(Meteor.userId());
  everyone.splice(index,1);
  index = everyone.indexOf(userId);
  everyone.splice(index,1);


  // This shows that admin has accepted an application and
  // an update needs to be sent to the newly added member
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "ACCEPTED APPLICATION",
    url: '/mybubbles/'+bubble._id+'/members',
    content: "Congratulations! " + bubble.title + " accepted your application"
  });

  //Sends an update to everyone who is not the new member 
  //nor the admin who accepted the member
  _.each(everyone, function(memberId){
    Meteor.call('update',{
      userId: memberId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: Meteor.user().username,
      updateType: "JOINED BUBBLE",
      url: '/mybubbles/'+bubble._id+'/members',
      content: " joined " + bubble.title
    });
  });

  //Clears "New Applicant" update when user has joined bubble
  newApplicantList = Updates.find({ invokerId: userId, updateType: "NEW APPLICANT"}).fetch();
  _.each(newApplicantList, function(update) {
    Meteor.call('setRead', update);
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
      url: '/mybubbles/'+bubble._id+"/home",
      content: Meteor.user().username + " edited the bubble " + bubble.title
    });
  });
}

//For bubble admins who were just promoted
createMemberPromoteUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "MEMBER PROMOTED",
      url: '/mybubbles/'+bubble._id+'/members',
    content: Meteor.user().username + " promoted you to admin of the bubble " + bubble.title
  });
}

//For bubble members who were just demoted
createAdminDemoteUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: Meteor.user().username,
    updateType: "MEMBER DEMOTED",
      url: '/mybubbles/'+bubble._id+'/members',
    content: Meteor.user().username + " demoted you to member of the bubble " + bubble.title
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
      url: '/mybubbles/'+bubble._id+'/members',
      content: " applied to be a member of the bubble " + bubble.title
    });
  });
}

