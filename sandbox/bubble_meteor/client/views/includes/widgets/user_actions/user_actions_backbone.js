Template.userActionsBackbone.rendered = function(){
	currentBubbleId = window.location.pathname.split("/")[2];
}

Template.userActionsBackbone.helpers({
  getAdminStatus: function() {
    //return Bubbles.find({'users.admins': this._id, '_id': Session.get('currentBubbleId')}).count();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isAdmin(this.id);
  },

  getMemberStatus: function() {
	 //return Bubbles.find({'users.members': this._id, '_id': Session.get('currentBubbleId')}).count();
    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isMember(this.id);
  },

  isSuperBubble: function() {
    var currentBubble  =  mybubbles.bubbleInfo.toJSON();
    var bubbleType     =  currentBubble.bubbleType;

    if (bubbleType == "super") {
      return true;
    } else {
      return false;
    }
  },
});

Template.userActionsBackbone.events({
  'click .remove-admin': function() {
  	// Disable the parent button
    event.stopPropagation();
    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    if(confirm("Are you sure you want to leave this bubble?"))
    {
	    //var bubble = Bubbles.findOne(currentBubbleId);
	    var bubble = mybubbles.bubbleInfo.toJSON();
	    var admins = bubble.users.admins;
	    var members = bubble.users.members;
	    var count = admins.length + members.length
	    if(count > 1){
	      Bubbles.update({_id:currentBubbleId},
	      {
	        $pull: {'users.admins': this.id}
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
	        var updates = Updates.find({bubbleId: currentBubbleId}, {read:false}).fetch();
	        _.each(updates, function(update){
	          Updates.update({_id: update._id}, {read:true});
	        });
	        var updateIds = _.pluck(updates, '_id');
	        //var currentBubbleId = Session.get('currentBubbleId');
	        var bubbleExplorePosts = Posts.find({postAsId: currentBubbleId}).fetch();
	        var bubbleOwnPosts = Posts.find({bubbleId: currentBubbleId}).fetch();
	        var bubblePosts = bubbleOwnPosts.concat(bubbleExplorePosts);
	        var bubblePostIds = _.pluck(bubblePosts, '_id');
	        

	        /*Posts.remove({_id: {$in: bubblePostIds}});
	        Updates.remove({_id: {$in: updateIds}});*/
	        Bubbles.remove({_id:currentBubbleId});

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