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
  },
  'click .activate': function() {
    if (Session.get(Session.get('currentBubbleId')+this.toString())){
      Session.set(Session.get('currentBubbleId')+this.toString(),undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+this.toString(),this.toString());
    }
  }
});