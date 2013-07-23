Template.userActions.helpers({
  getAdminStatus: function() {
    return Bubbles.find({'users.admins': this._id, '_id': Session.get('currentBubbleId')}).count();
  },

  getMemberStatus: function() {
	 return Bubbles.find({'users.members': this._id, '_id': Session.get('currentBubbleId')}).count();
  }
});

Template.userActions.events({
  'click .remove-admin': function() {
  	// Disable the parent button
    event.stopPropagation();
    if(confirm("Are you sure you want to leave this bubble?"))
    {
	    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
	    var admins = bubble.users.admins;
	    var members = bubble.users.members;
	    var count = admins.length + members.length
	    if(count > 1){
	      Bubbles.update({_id:Session.get('currentBubbleId')},
	      {
	        $pull: {'users.admins': this._id}
	      });

	      //If no more admins are left, the earliest member will be an admin
	      if(admins.length == 1){
	        if(confirm('If you remove yourself, the earliest member of the bubble will be promoted to admin.  Are you sure you want to remove yourself from this bubble?'))
	        {
	          Bubbles.update({_id:Session.get('currentBubbleId')},
	          {
	            $addToSet: {'users.admins': members[0]},
	            $pull: {'users.members': members[0]}
	          });
	        }
	      }
	    }else{
	      if(confirm("You are the last remaining member.  Removing yourself will delete this bubble.  Are you sure you want to delete this bubble?"))
	      {
	        var updates = Updates.find({bubbleId: Session.get('currentBubbleId')}, {read:false}).fetch();
	        _.each(updates, function(update){
	          Updates.update({_id: update._id}, {read:true});
	        });
	        Bubbles.remove({_id:Session.get('currentBubbleId')});

	        //Route to the next available bubble or to the search page
	        var bubble = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins': Meteor.userId()}]}, {sort: {submitted: -1}}).fetch();
	        if(bubble.length > 0){
	          Meteor.Router.to('/mybubbles/'+bubble[0]._id+'/home');
	        }else{
	          Meteor.Router.to('/mybubbles/search/bubbles');
	        }
	      }
	    }
	}
  },

  'click .remove-member': function() {
    event.stopPropagation();
     if(confirm("Are you sure you want to leave this bubble?"))
    {
	    Bubbles.update({_id:Session.get('currentBubbleId')},
	    {
	      $pull: {'users.members': this._id}
	    });
	    Session.set(Session.get('currentBubbleId')+this._id,undefined);

	    if(this._id != Meteor.userId()){
	      //Create update for member who is removed from bubble
	      createRemoveMemberUpdate(this._id);
	    }
	}
  }
});