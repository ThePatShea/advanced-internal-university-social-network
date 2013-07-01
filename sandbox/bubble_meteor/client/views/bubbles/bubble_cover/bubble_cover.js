Template.bubbleCover.helpers({
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
	getLongCategory: function() {
		console.log(this);
		return _.find(categories, function(category) {

			return this.category == category.name_short;
		}).name_long;
	}
});

Template.bubbleCover.events({
	'click .join-apply': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.applicants': Meteor.userId()}
    });
    createNewApplicantUpdate();
  },
  'click .cancel-apply': function() {
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': Meteor.userId()}
    });
  }
});