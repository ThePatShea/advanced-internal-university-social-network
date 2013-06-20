Template.bubbleInviteesList.helpers({
	getInvitees: function(){
    return this.users.invitees;
  }
});

Template.bubbleInviteesList.events({
	'click .remove-invitee': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.invitees': this.toString()}
    });
  }
});