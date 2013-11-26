// TODO: Rewrite me
Template.adminActionsBackbone.created = function(){
  currentBubbleId = window.location.pathname.split("/")[2];
};

Template.adminActionsBackbone.destroyed = function(){
};

Template.adminActionsBackbone.helpers({
  getAdminStatus: function() {
    var bubbleInfo = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isAdmin(bubbleInfo, this.id);
  },

  getApplicantStatus: function() {
    var bubbleInfo = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isApplicant(bubbleInfo, this.id);
  },

  getMemberStatus: function() {
    var bubbleInfo = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isMember(bubbleInfo, this.id);
  },

  getInviteeStatus: function() {
    var bubbleInfo = Session.get('bubbleInfo');
    return BubbleDataNew.Helpers.isInvitee(bubbleInfo, this.id);
  }
});

Template.adminActionsBackbone.events({
	'click .demote-admin': function(event){
  	// Disable the parent button
    event.stopPropagation();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    var bubble = Session.get('bubbleInfo');
    var that = this;
    var admins = bubble.users.admins;

    // TODO: Fix me
    if (admins.length > 1) {
      var members = bubble.users.members;
      members.push(this.id);

      var updatedBubble = {
        'users.admins': _.without(admins, this.id),
        'users.members': members
      };

      BubbleDataNew.Helpers.updateBubble(bubble.id, updatedBubble, function(error) {
        if (!error) {
          createAdminDemoteUpdate(this.id);
        }

        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'admins', 'members']
        });
      });
    } else {
      // TODO: Fix me
      alert('You are the last remaining admin. Please promote another member before demoting yourself.');
    }
  },

  'click .accept': function(event){
    event.stopPropagation();
    event.preventDefault();

    if (typeof this.id === 'undefined'){
      this.id = this._id;
    }

    var that = this;
    var bubbleInfo = Session.get('bubbleInfo');

    bubbleInfo.users.members.push(this.id);

    var updatedBubble = {
      'users.members': bubbleInfo.users.members,
      'users.applicants': _.without(bubbleInfo.users.applicants, this.id)
    };

    BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
      if (!error) {
        createNewMemberUpdate(that.id, currentBubbleId);
      }

      $('#bubble-invitation').trigger({
        type: 'bubbleRefresh',
        sections: ['bubble', 'members', 'applicants']
      });
    });
  },

  'click .deny': function(event){
    event.stopPropagation();
    event.preventDefault();

    if (typeof this.id === 'undefined') {
      this.id = this._id;
    }

    var that = this;
    var bubbleInfo = Session.get('bubbleInfo');
    var updatedBubble = {
      'users.applicants': _.without(bubbleInfo.users.applicants, this.id)
    };

    BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
      if (!error) {
        createRejectApplicationUpdate(that.id);
      }

      $('#bubble-invitation').trigger({
        type: 'bubbleRefresh',
        sections: ['bubble', 'applicants']
      });
    });
  },

  'click .promote-member': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (typeof this.id === 'undefined') {
      this.id = this._id;
    }

    var that = this;
    var bubbleInfo = Session.get('bubbleInfo');

    bubbleInfo.users.admins.push(this.id);
    var updatedBubble = {
      'users.admins': bubbleInfo.users.admins,
      'users.members': _.without(bubbleInfo.users.members, this.id)
    };

    BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
      if (!error) {
        createMemberPromoteUpdate(that.id);
      }

      $('#bubble-invitation').trigger({
        type: 'bubbleRefresh',
        sections: ['bubble', 'admins', 'members']
      });
    });
  },

  'click .remove-member': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (typeof this.id === 'undefined') {
      this.id = this._id;
    }

    var that = this;
    var bubbleInfo = Session.get('bubbleInfo');
    var updatedBubble = {
      'users.members': _.without(bubbleInfo.users.members, this.id)
    };

    BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
      if (!error) {
        if (that.id !== Meteor.userId()) {
          //Create update for member who is removed from bubble
          createRemoveMemberUpdate(this.id);
        }
      }

      $('#bubble-invitation').trigger({
        type: 'bubbleRefresh',
        sections: ['bubble', 'members']
      });
    });
  },

  'click .uninvite': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (typeof this.id === 'undefined'){
      this.id = this._id;
    }

    var that = this;
    var bubbleInfo = Session.get('bubbleInfo');
    var updatedBubble = {
      'users.invitees': _.without(bubbleInfo.users.invitees, this.id)
    };

    BubbleDataNew.Helpers.updateBubble(bubbleInfo.id, updatedBubble, function(error) {
      if (!error) {
        if (that.id !== Meteor.userId()) {
          //CREATE NEW UPDATE FUNCTION FOR UNINVITE
          createRemoveMemberUpdate(this.id);
        }
      }

      $('#bubble-invitation').trigger({
        type: 'bubbleRefresh',
        sections: ['bubble', 'invitees']
      });
    });
  }
});