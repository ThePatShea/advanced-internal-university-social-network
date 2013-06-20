Template.bubbleMembersList.helpers({
	getMembers: function() {
		return this.users.members;
	},
  chosen: function() {
    if(Session.get(Session.get('currentBubbleId')+Meteor.userId) == this.toString()){
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
    if (Session.get(Session.get('currentBubbleId')+Meteor.userId)){
      Session.set(Session.get('currentBubbleId')+Meteor.userId,undefined);
    }else{
      Session.set(Session.get('currentBubbleId')+Meteor.userId,this.toString());
    }
  },
  'click .deactivate': function() {
  }

});

