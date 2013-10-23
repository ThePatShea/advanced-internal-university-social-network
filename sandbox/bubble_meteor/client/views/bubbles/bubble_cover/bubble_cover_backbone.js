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
    //return _.contains(this.users.invitees, Meteor.userId());
    var inviteePages = mybubbles.Invitees.getNumPages();
  },

	hasApplied: function() {
		// var users = Bubbles.findOne(Session.get('currentBubbleId')).users;
    var isApplicantAjax = $.ajax({url: '/2013-09-11/isapplicant?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId(),async:false});
    if(isApplicantAjax.responseText == 'True'){
      return true;
    }
    else{
      return false;
    }
	},

	hasJoinedBubble: function() {
    var isMemberAjax = $.ajax({url: '/2013-09-11/ismember?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId(),async:false});
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId(),async:false});
    if(isMemberAjax.responseText == 'True' || isAdminAjax.responseText == 'True'){
      return true;
    }
    else{
      return false;
    }
	},

  isAdminBackbone: function(){
    var isAdminAjax = $.ajax({url: '/2013-09-11/isadmin?bubbleid=' + currentBubbleId + '&userid=' + Meteor.userId(),async:false});
    if(isAdminAjax.responseText == 'True'){
      return true;
    }
    else{
      return false;
    }
  },

  isSuperBubbleBackbone: function(){
    var bubbleInfo = mybubbles.bubbleInfo.toJSON();
    return 'super' == bubbleInfo.bubbleType;
  },

  getBubbleUsersCountBackbone: function(){
    var userCount = mybubbles.Members.bubbleMembers.count + mybubbles.Admins.bubbleAdmins.count;
    return userCount;
  }
});

Template.bubbleCoverBackbone.events({
  'click #bubble-pic': function() {
    var imgSrc = $("#bubble-pic").attr('src');
    if (imgSrc == "/img/Bubble-Profile.jpg" && mybubbles.isAdmin(Meteor.userId()) ) {
      Meteor.Router.to('bubbleEdit',Session.get('currentBubbleId'));
    } else {
      console.log("Changed")
    }
  },
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

