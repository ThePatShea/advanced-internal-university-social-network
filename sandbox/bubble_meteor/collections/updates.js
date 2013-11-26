Updates = new Meteor.Collection('updates');

Updates.allow({
  update: ownsUpdate,
  remove: ownsUpdate
});

Meteor.methods({
  update: function(updateAttributes){
    console.log("this ran");
    var user = Meteor.users.findOne(Meteor.userId());

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
  if(typeof post.bubbleId != 'undefined'){
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
}

//For bubble admins n members when post is created
createPostUpdate = function(post) {
  if (typeof post.bubbleId != 'undefined') {
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
      //Create mobile update - COMMENTED OUT FOR NOW
      /*
      if (typeof Meteor.users.findOne(userId).deviceToken != "undefined"){
        Meteor.call(
          'getUA',
          post.author + " created a new " + post.postType + " in " + bubble.title,
          Meteor.users.findOne(userId).deviceToken
        );
      }
      */
    });
  }
}

//For everyone attending
createEditEventUpdate = function(userId, postId) {
  //Removes previous updates that shows post is edited
  var oldUpdates = Updates.find({read: false, postId: postId, updateType: 'edited post'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  var post = Posts.findOne(postId);

  if(typeof post.bubbleId != 'undefined'){
    var bubble = Bubbles.findOne(post.bubbleId);
    var attendees = post.attendees;
    //Remove post owner from list of attendees
    attendees = _.reject(attendees, function(attendeeId){
      return attendeeId == userId;
    });
    _.each(attendees, function(uId){
      var user = Meteor.users.findOne({_id:uId});
      var invoker = Meteor.users.findOne(Meteor.userId());
      Meteor.call('update',{
        userId: user._id,
        postId: post._id,
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        invokerName: invoker.username,
        updateType: "edited post",
        url: '/mybubbles/'+bubble._id+'/posts/'+post._id,
        content: invoker.username + " edited " + post.name
      });
    });
  }
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

  invoker = Meteor.users.findOne(Meteor.userId());
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: invoker.username,
    updateType: "removed from bubble",
    url: '/dashboard',
    content: "You have been removed from " + bubble.title
  });
}

//For users who are rejected by bubble
createRejectApplicationUpdate = function(userId) {
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  invoker = Meteor.users.findOne(Meteor.userId());
  Meteor.call('update',{
    userId: userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: invoker.username,
    updateType: "application rejected",
    url: '/dashboard',
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  //Remove post owner from list of attendees
  var attendees = post.attendees;
  var index = attendees.indexOf(invoker.username);
  attendees.splice(index,1);

  _.each(attendees, function(username){
    var user = Meteor.users.findOne({username:username});
    Meteor.call('update',{
      userId: user._id,
      postId: post._id,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: invoker.username,
      updateType: "event cancelled",
      url: '/mybubbles/'+bubble._id+"/home",
      content: invoker.username + " canceled the event " + post.name
    });
  });

}

//For users who have received an invitation
createInvitationUpdate = function(userList) {
  var invoker = Meteor.users.findOne(Meteor.userId());
  var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
  _.each(userList, function(userId){
    Meteor.call('update',{
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: invoker.username,
      updateType: "invitation",
      url: '/settings/invites',
      content: invoker.username + " invited you to " + bubble.title
    });

    //Create mobile update
    // if(Meteor.users.findOne(userId).deviceToken){
    //   Meteor.call(
    //     'getUA',
    //     invoker.username + " invited you to " + bubble.title,
    //     Meteor.users.findOne(userId).deviceToken
    //   );
    // }

  });
}

//For everyone attending
createNewAttendeeUpdate = function(postId) {
  var post = Posts.findOne(postId);

  if(typeof post.bubbleId != 'undefined'){
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

    var invoker = Meteor.users.findOne(Meteor.userId());

    _.each(attendees, function(userId){
      var user = Meteor.users.findOne(userId);
      Meteor.call('update',{
        userId: user._id,
        postId: postId,
        bubbleId: bubble._id,
        invokerId: Meteor.userId(),
        invokerName: invoker.username,
        updateType: "new attendee",
        url: '/mybubbles/'+bubble._id+'/posts/'+post._id,
        content: " is attending " + post.name
      });
    });
  }
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  _.each(everyone, function(userId){
    Meteor.call('update',{
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: invoker.username,
      updateType: "edited bubble",
      url: '/mybubbles/'+bubble._id+"/home",
      content: invoker.username + " edited the bubble " + bubble.title
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: invoker.username,
    updateType: "member promoted",
      url: '/mybubbles/'+bubble._id+'/members',
    content: invoker.username + " promoted you to admin of the bubble " + bubble.title
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  Meteor.call('update',{
    userId: userId,
    bubbleId: Session.get('currentBubbleId'),
    invokerId: Meteor.userId(),
    invokerName: invoker.username,
    updateType: "member demoted",
      url: '/mybubbles/'+bubble._id+'/members',
    content: invoker.username + " demoted you to member of the bubble " + bubble.title
  });
}

//For admins where there are new applicants
createNewApplicantUpdate = function(bubbleId) {
  var bubble = Bubbles.findOne(bubbleId);

  //Clears duplicated updates
  var oldUpdates = Updates.find({read: false, invokerId: Meteor.userId(), bubbleId: bubble._id, updateType: 'new applicant'}).fetch();
  _.each(oldUpdates, function(update) {
    Meteor.call('setRead', update);
  });

  var invoker = Meteor.users.findOne(Meteor.userId());

  _.each(bubble.users.admins, function(adminId){
    Meteor.call('update',{
      userId: adminId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: invoker.username,
      updateType: "new applicant",
      url: '/mybubbles/'+bubble._id+'/members',
      content: " applied to be a member of the bubble " + bubble.title
    });

    //Create mobile update
    if(Meteor.users.findOne(adminId).deviceToken){
      Meteor.call(
        'getUA',
        invoker.username + " applied to be a member of the bubble " + bubble.title,
        Meteor.users.findOne(adminId).deviceToken
      );
    }
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  var superUsers = Meteor.users.find({userType:'superuser'}).fetch();

  var parentId = "";

  if(typeof flag.bubbleId !== "undefined")
    parentId = flag.bubbleId;
  if(typeof flag.exploreId !== "undefined")
    parentId = flag.exploreId;

  _.each(superUsers, function(user) {
    if(user._id != Meteor.userId()){
      Meteor.call('update',{
        userId: user._id,
        bubbleId: flag.bubbleId,
        postId: flag.postId,
        invokerId: Meteor.userId(),
        invokerName: invoker.username,
        updateType: "post flagged",
        url: '/mybubbles/'+parentId+'/posts/'+flag.postId,
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

  var invoker = Meteor.users.findOne(Meteor.userId());

  var superUsers = Meteor.users.find({userType:'2'}).fetch();

  var parentId = "";

  if(typeof flag.bubbleId !== "undefined")
    parentId = flag.bubbleId;
  if(typeof flag.exploreId !== "undefined")
    parentId = flag.exploreId;

  _.each(superUsers, function(user) {
    if(user._id != Meteor.userId()){
      Meteor.call('update',{
        userId: user._id,
        bubbleId: flag.bubbleId,
        postId: flag.postId,
        invokerId: Meteor.userId(),
        invokerName: invoker.username,
        updateType: "post unflagged",
        url: '/mybubbles/'+parentId+'/posts/'+flag.postId,
        content: post.name + " has been unflagged"
      });
    }
  });
}

//Sends an update when bubbles are deleted
createDeleteBubbleUpdate = function(bubbleId) {
  var bubble = Bubbles.findOne(bubbleId);
  var admins = bubble.users.admins;
  var users = admins.concat(bubble.users.members);
  var invoker = Meteor.users.findOne(Meteor.userId());
  _.each(users, function(userId) {
    Meteor.call('update', {
      userId: userId,
      bubbleId: bubble._id,
      invokerId: Meteor.userId(),
      invokerName: invoker.username,
      updateType: "bubble deleted",
      url: '/dashboard',
      content: bubble.title + " has been deleted"
    });
  });
}

//Sends an update to the owner when lvl 3 users delete posts due to flags
createPostDeletedUpdate = function(postId) {
  var invoker = Meteor.users.findOne(Meteor.userId());
  var post = Posts.findOne(postId);
  var bubble = Bubbles.findOne(post.bubbleId);
  Meteor.call('update', {
    userId: post.userId,
    bubbleId: bubble._id,
    invokerId: Meteor.userId(),
    invokerName: Minvoker.username,
    updateType: "post deleted",
    url: '/mybubbles/'+bubble._id+'/home',
    content: post.name + " has been deleted by " + invoker.username
  });
}

