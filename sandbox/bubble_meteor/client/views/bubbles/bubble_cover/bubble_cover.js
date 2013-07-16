Template.bubbleCover.helpers({
	hasApplied: function() {
		// var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
		return _.contains(this.users.applicants, Meteor.userId());
	},

	hasJoinedBubble: function() {
		return _.contains(this.users.members, Meteor.userId())
					|| _.contains(this.users.admins, Meteor.userId());
	}
});

Template.bubbleCover.events({
	'click .join-apply': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Bubble', 'Join Bubble', this.title]);
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.applicants': Meteor.userId()}
    });
    createNewApplicantUpdate();
  },
  'click .cancel-apply': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Bubble', 'Cancel Application', this.title]);
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': Meteor.userId()}
    });
  }
});