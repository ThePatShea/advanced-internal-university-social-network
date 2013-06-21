Template.bubbleInviteesList.helpers({
	getInvitees: function(){
		var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    return bubble.users.invitees;
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