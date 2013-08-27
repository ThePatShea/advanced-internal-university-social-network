Bubbles = new Meteor.Collection('bubbles');

Bubbles.allow({
   update: isConnectedToBubble,
   remove: ownsBubble
 });

//ADD CURRENT BUBBLES TO SEARCH INDEX
var bubbles = Bubbles.find({}, {fields: {'title': 1, '_id': 1}});
bubbles.forEach(function(bubble) {
  Meteor.call("addBubbleToIndex", bubble._id, bubble.title);
});

Meteor.methods({
	bubble: function(bubbleAttributes){
		var user = Meteor.user(),
			bubbleWithSameName = Bubbles.findOne({title:bubbleAttributes.title});

		// ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");
    
    // ensure the post has a title
    if (!bubbleAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    // check that there are no previous bubbles with the same title
    if (bubbleAttributes.title && bubbleWithSameName) {
      throw new Meteor.Error(302, 
        'This bubble has already been created', 
        bubbleWithSameName._id);
    }

    var bubble = _.extend(_.pick(bubbleAttributes, 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'), {
    	submitted: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      users: {
        applicants: [],
        invitees: [],
        members: [],
        admins: [user._id]
      }
    });

    bubbleId = Bubbles.insert(bubble);

    return bubbleId;
	},

  deleteBubble: function(bubbleId) {
    Updates.update({bubbleId: bubbleId}, {$set: {read: true}});
    createDeleteBubbleUpdate(bubbleId);
    Bubbles.remove(bubbleId);
  },

  addInvitee: function(bubbleId,userList) {
    if(userList && bubbleId){   
      Bubbles.update({_id:bubbleId},
      {
        $addToSet: {'users.invitees': {$each: userList}}
      }); 
    }
  },

  removeInvitee: function(bubbleId){
    Bubbles.update({_id:bubbleId},
    {
      $pull: {'users.invitees': Meteor.userId()}
    });
  },

  acceptInvitation: function(bubbleId) {
    Bubbles.update({_id: bubbleId},
    {
      $addToSet: {'users.members': Meteor.userId()},
      $pull: {'users.invitees': Meteor.userId()}
    });
    createNewMemberUpdate(Meteor.userId());
  },

  joinBubble: function(bubbleId) {
    Bubbles.update({_id: bubbleId},
    {
      $addToSet: {'users.applicants': Meteor.userId()}
    });
    createNewApplicantUpdate(bubbleId);
  },

  cancelJoinBubble: function(bubbleId) {
    Bubbles.update({_id:bubbleId},
    {
      $pull: {'users.applicants': Meteor.userId()}
    });
    Updates.update({bubbleId: bubbleId, updateType: 'new applicant'},
      {$set: {read: true}});
  }

});
