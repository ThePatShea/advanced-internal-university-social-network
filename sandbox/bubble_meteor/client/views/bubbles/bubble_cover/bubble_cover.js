/*
Template.bubbleCover.rendered = function() {
  $(".cover-pic").bind('load', function() {
    setTimeout(function(){
      Session.set('bubbleLoading', 'false');  // Handles loading graphic
    },500)
  });
}
*/


Template.bubbleCover.helpers({
        hasBeenInvited: function() {
          return _.contains(this.users.invitees, Meteor.userId());
        },

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
  'click .invite-accept': function() {
    Meteor.call('acceptInvitation', this._id);
  },
  'click .invite-deny': function() {
    Meteor.call('removeInvitee', this._id);
  },
  'click .join-apply': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Bubble', 'Join Bubble', this.title]);
    Meteor.call('sendApplicantEmail', Meteor.userId(), this._id);
    Meteor.call('joinBubble', Session.get('currentBubbleId'));
  },
  'click .cancel-apply': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Bubble', 'Cancel Application', this.title]);
    Meteor.call('cancelJoinBubble', Session.get('currentBubbleId'));
  }
});

Template.bubbleCover.rendered = function(){
  $(".edit-bubble").on("click", function() {
    //Logs the action that user is doing
    Meteor.call('createLog', 
      { action: 'click-editBubbleButton' }, 
      window.location.pathname, 
      function(error) { if(error) { throwError(error.reason); }
    });
  });
}