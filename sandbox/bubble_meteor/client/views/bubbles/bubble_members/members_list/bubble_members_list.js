Template.bubbleMembersList.helpers({
	getMembers: function() {
		return this.users.members;
	}
});

Template.bubbleMembersList.events({
	'click .promote-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.admins': this.toString()},
      $pull: {'users.members': this.toString()}
    });
  },
  'click .remove-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.members': this.toString()}
    });
  }
});

