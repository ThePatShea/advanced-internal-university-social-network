Explores = new Meteor.Collection('explores');

Explores.allow({
   update: ownsExplore,
   remove: exploreAdmin
 });

Meteor.methods({
	explore: function(exploreAttributes){
		var user = Meteor.user(),
			exploreWithSameName = Explores.findOne({title:exploreAttributes.title});

		// ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");
    
    // ensure the post has a title
    if (!exploreAttributes.title)
      throw new Meteor.Error(422, 'Please fill in a headline');

    // check that there are no previous bubbles with the same title
    if (exploreAttributes.title && exploreWithSameName) {
      throw new Meteor.Error(302, 
        'This explore has already been created', 
        exploreWithSameName._id);
    }

    var explore = _.extend(_.pick(exploreAttributes, 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'exploreProfileIconName', 'exploreIcon'), {
    	submitted: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      /*users: {
        applicants: [],
        invitees: [],
        members: [],
        admins: [user._id]
      }*/
    });

    exploreId = Explores.insert(explore);

    return exploreId;
	}

  /*addInvitee: function(bubbleId,userList){
    if(userList && bubbleId){   
      Bubbles.update({_id:bubbleId},
      {
        $addToSet: {'users.invitees': {$each: userList}}
      }); 
    }
  },

  removeInvitee: function(bubbleId, userId){
    Bubbles.update({_id:bubbleId},
    {
      $pull: {'users.invitees': userId}
    });
  }*/

});
