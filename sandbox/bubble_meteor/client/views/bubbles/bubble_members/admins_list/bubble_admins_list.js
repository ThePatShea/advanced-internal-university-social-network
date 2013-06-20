Template.bubbleAdminsList.helpers({
	getAdmins: function() {
    return this.users.admins;
  },
  ifNotSelf: function() {
  	return this.toString() != Meteor.userId();
  }
});

Template.bubbleAdminsList.events({
	'click .demote-admin': function(){
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.members': this.toString()},
      $pull: {'users.admins': this.toString()}
    });
  }
});
