Template.bubbleMembersList.helpers({
	getMembers: function() {
		return this.users.members;
	},
  chosen: function() {
    return Session.get(Session.get('currentBubbleId')+Meteor.userId);
  },
  notChosen: function() {
    return !Session.get(Session.get('currentBubbleId')+Meteor.userId);
  }
});

Template.bubbleMembersList.events({
	'click .promote-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.admins': this.toString()},
      $pull: {'users.members': this.toString()}
    });
    Session.set(Session.get('currentBubbleId')+Meteor.userId,undefined);
  },
  'click .remove-member': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.members': this.toString()}
    });
    Session.set(Session.get('currentBubbleId')+Meteor.userId,undefined);
  },
  'click .activate': function() {
    Session.set(Session.get('currentBubbleId')+Meteor.userId,true);
  },
  'click .deactivate': function() {
    Session.set(Session.get('currentBubbleId')+Meteor.userId,undefined);
  }

});

