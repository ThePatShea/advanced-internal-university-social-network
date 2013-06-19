Bubbles = new Meteor.Collection('bubbles');

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

    var bubble = _.extend(_.pick(bubbleAttributes, 'title', 'description', 'category'), {
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

  addInvitee: function(bubbleId,userList){
    var users = Bubbles.findOne(bubbleId).users;
    _.each(userList, function(userId) {
      if(!_.contains(users.invitees,userId)){
        users.invitees.push(userId);
      }
    });
    Bubbles.update({_id:bubbleId},
    {
      $set: {users: users}
    }); 
  }

});
