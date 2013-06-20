Template.bubbleCover.helpers({
	hasNotJoinedBubble: function() {
		//check that user is not a member of bubble
		var users = Bubbles.findOne(Session.get('currentBubbleId')).users;

		return !(_.contains(users.members, Meteor.userId()) || 
							_.contains(users.admins, Meteor.userId()) ||
							_.contains(users.invitees, Meteor.userId()));
	},
	hasJoinedBubble: function() {
		//check that user is not a member of bubble
		var users = Bubbles.findOne(Session.get('currentBubbleId')).users;

		return (_.contains(users.members, Meteor.userId()) || 
							_.contains(users.admins, Meteor.userId()) ||
							_.contains(users.invitees, Meteor.userId()));
	},
	hasApplied: function() {
		var users = Bubbles.findOne(Session.get('currentBubbleId')).users;

		return _.contains(users.applicants, Meteor.userId());
	},
	hasNotApplied: function() {
		var users = Bubbles.findOne(Session.get('currentBubbleId')).users;

		return !_.contains(users.applicants, Meteor.userId());
	}
});

Template.bubbleCover.events({
	'click .join-apply': function() {
		console.log("apply");
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.applicants': Meteor.userId()}
    });
  },
  'click .cancel-apply': function() {
		console.log("cancel");
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': Meteor.userId()}
    });
  }
});