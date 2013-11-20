Template.bubbleCoverBackbone.rendered = function(){
  console.log("Cover Rendered");
  //Log clicking of edit bubble button
  /*$(".lbl").on("click", function() {
    Meteor.call('createLog',  "mybubble", 'editBubble', 'clickEditBubbleButton', false);
  });*/
};

Template.bubbleCoverBackbone.created = function() {
  console.log("Cover Created");
};


Template.bubbleCoverBackbone.helpers({
  hasBeenInvited: function() {
    if (this.users)
      return _.contains(this.users.invitees, Meteor.userId());

    return false;
  },

	hasApplied: function() {
    if (this.users)
      return _.contains(this.users.applicants, Meteor.userId());

    return false;
	},

	hasJoinedBubble: function() {
    if (this.users) {
      var userId = Meteor.userId();
      return _.contains(this.users.members, userId) || _.contains(this.users.admins, userId);
    }

    return false;
	},

  isAdminBackbone: function() {
    if (this.users)
      return _.contains(this.users.admins, Meteor.userId());
  },

  isSuperBubbleBackbone: function(){
    return this.bubbleType === 'super';
  },

  getBubbleUsersCountBackbone: function(){
    if (this.users)
      return this.users.admins.length + this.users.members.length;

    return 0;
  }
});

Template.bubbleCoverBackbone.events({
  'click #bubble-pic': function() {
    var imgSrc = $("#bubble-pic").attr('src');
    if (imgSrc == "/img/Bubble-Profile.jpg" && mybubbles.isAdmin(Meteor.userId()) ) {
      Meteor.Router.to('bubbleEdit',Session.get('currentBubbleId'));
    } else if (mybubbles.isMember(Meteor.userId())){
      Meteor.Router.to('bubblePageBackbone',Session.get('currentBubbleId'));
    }
  },
  'click .invite-accept': function() {
    Meteor.call('acceptInvitation', this.id);
    Meteor.Router.to('/mybubbles/'+this.id+'/home');
  },
  'click .invite-deny': function() {
    var id = this.id;
    Meteor.call('removeInvitee', this.id, function(){
      window.location.href = '/mybubbles/'+id+'/public';
    });
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

