Template.bubbleCoverBackbone.created = function(){
  mybubbles = undefined;
  currentBubbleId = undefined;
}


Template.bubbleCoverBackbone.rendered = function(){
  //Log clicking of edit bubble button
  $(".lbl").on("click", function() {
    Meteor.call('createLog',  "mybubble", 'editBubble', 'clickEditBubbleButton', false);
  });


  if(currentBubbleId != window.location.pathname.split('/')[2]){
    currentBubbleId = window.location.pathname.split('/')[2];
    mybubbles = new BubbleData.MyBubbles({
      bubbleId: currentBubbleId,
      fields: ['title', 'profilePicture', 'category', 'bubbleType']
    });
  }


}


Template.bubbleCoverBackbone.helpers({
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
	},

  isSuperBubbleBackbone: function(){
    var bubbleInfo = mybubbles.bubbleIndo.toJSON();
    return 'super' == bubbleInfo.bubbleType;
  }
});

Template.bubbleCoverBackbone.events({
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

