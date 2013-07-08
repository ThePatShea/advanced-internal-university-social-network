Template.bubbleCover.helpers({
	hasApplied: function() {
		// var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
		return _.contains(this.users.applicants, Meteor.userId());
	},
	getLongCategory: function() {
		var currentCat = this.category;
		var category =  _.find(categories, function(cat) {
			return currentCat == cat.name_short;
		});
		if(category) {
			return category.name_long;
		}
	},
	hasJoinedBubble: function() {
		return _.contains(this.users.members, Meteor.userId())
					|| _.contains(this.users.admins, Meteor.userId());
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