Template.bubbleMembersList.helpers({
	getMembers: function() {
		return this.users.members;
	},
  chosen: function() {
    //Checks if user has clicked on username to activate options
    if(Session.get(Session.get('currentBubbleId')+this.toString()) == this.toString()){
      return true;
    }
  }
});

Template.bubbleMembersList.events({
	'click .promote-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.admins': this.toString()},
      $pull: {'users.members': this.toString()}
    });
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);

    //Create update for member who is promoted
    createMemberPromoteUpdate(this.toString());
  },
  'click .remove-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.members': this.toString()}
    });
    Session.set(Session.get('currentBubbleId')+this.toString(),undefined);

    //Create update for member who is removed from bubble
    createRemoveMemberUpdate(this.toString());
  },
  'click .activate': function() {
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  }

});

