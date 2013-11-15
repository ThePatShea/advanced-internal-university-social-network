// TODO: Rewrite me
Template.adminActionsBackbone.destroyed = function(){
  getAdminsDep = new Deps.Dependency;
  getMembersDep = new Deps.Dependency;
  getApplicantsDep = new Deps.Dependency;
  getInviteesDep = new Deps.Dependency;
};

Template.adminActionsBackbone.created = function(){

  currentBubbleId = window.location.pathname.split("/")[2];

  getAdminsDep = new Deps.Dependency;
  getMembersDep = new Deps.Dependency;
  getApplicantsDep = new Deps.Dependency;
  getInviteesDep = new Deps.Dependency;
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
    var admins = bubble.users.admins;

    // TODO: Fix me
    if(admins.length > 1) {
      Bubbles.update({_id:currentBubbleId},
      {
        $addToSet: {'users.members': this.id},
        $pull: {'users.admins': this.id}
      }, function() {
        // TODO: Fix me
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'admins', 'members'],
          timeout: 2000
        });
      });
      createAdminDemoteUpdate(this.id);
    } else {
      alert("You are the last remaining admin. Please promote another member before demoting yourself.");
    }
  },

  //This happens when admin leaves the bubble
  //NEEDS TO BE WORKED ON IF WE DECIDE TO RE-IMPLEMENT THIS FUNCTIONALITY
  'click .remove-admin': function(event) {
  	// Disable the parent button
    event.stopPropagation();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    var bubble = Session.get('bubbleInfo');
    var admins = bubble.users.admins;
    var members = bubble.users.members;
    var count = admins.length + members.length
    if(count > 1){
      Bubbles.update({_id:currentBubbleId},
      {
        $pull: {'users.admins': this.id}
      });

      //If no more admins are left, the earliest member will be an admin
      if(admins.length == 1){
        if(confirm('If you remove yourself, the earliest member of the bubble will be promoted to admin.  Are you sure you want to remove yourself from this bubble?'))
        {
          Bubbles.update({_id:Session.get('currentBubbleId')},
          {
            $addToSet: {'users.admins': members[0]},
            $pull: {'users.members': members[0]}
          });

          // TODO: Is this really necessary, as user will be redirected to user profile?
          /*
          var reRoute = function(id, currentBubbleId){
            //bubbleDep.changed();
            return function(){
              Session.set('currentBubbleId', currentBubbleId);
              Meteor.Router.to('/settings/userprofile/' + id);
              console.log('Admin Actions: ', id);
            }
          }
          mybubbles.Admins.refreshCollection();
          mybubbles.Members.refreshCollection();
          mybubbles.Invitees.refreshCollection();
          mybubbles.Applicants.refreshCollection(reRoute(this.id, currentBubbleId));
          */
          Meteor.Router.to('/settings/userprofile/' + this.id);
        }
      }
    } else {
      if (confirm("You are the last remaining member.  Removing yourself will delete this bubble.  Are you sure you want to delete this bubble?")) {
        var updates = Updates.find({bubbleId: currentBubbleId}, {read:false}).fetch();
        _.each(updates, function(update){
          Updates.update({_id: update._id}, {read:true});
        });
        Bubbles.remove({_id:currentBubbleId});

        //Route to the next available bubble or to the search page
        var bubble = Bubbles.find({$or: [{'users.members': Meteor.userId()},{'users.admins': Meteor.userId()}]}, {sort: {submitted: -1}}).fetch();
        if(bubble.length > 0){
          Meteor.Router.to('/mybubbles/'+bubble[0]._id+'/home');
        }else{
          Meteor.Router.to('/mybubbles/search/bubbles');
        }
      }
    }
  },

  'click .accept': function(event){
    event.stopPropagation();
    event.preventDefault();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    Bubbles.update({_id:currentBubbleId},
    {
      $addToSet: {'users.members': this.id},
      $pull: {'users.applicants': this.id}
    }, function() {
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'members', 'applicants'],
          timeout: 2000
        });
      });

    //Create update to inform user about accpeted application
    createNewMemberUpdate(this.id, currentBubbleId);
  },

  'click .deny': function(event){
    event.stopPropagation();
    event.preventDefault();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    Bubbles.update({_id:currentBubbleId},
    {
      $pull: {'users.applicants': this.id}
    }, function(){
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'applicants'],
          timeout: 2000
        });
    });

    //Create update to inform user about rejected application
    createRejectApplicationUpdate(this.id);
  },

  'click .promote-member': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    Bubbles.update({_id:currentBubbleId},
    {
      $addToSet: {'users.admins': this.id},
      $pull: {'users.members': this.id}
    }, function(){
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'admins', 'members'],
          timeout: 2000
        });
    });

    //Create update for member who is promoted
    createMemberPromoteUpdate(this.id);
  },

  'click .remove-member': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    Bubbles.update({_id:currentBubbleId},
    {
      $pull: {'users.members': this.id}
    }, function(){
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'members'],
          timeout: 2000
        });
    });
    //Session.set(Session.get('currentBubbleId')+this._id,undefined);

    if(this.id != Meteor.userId()){
      //Create update for member who is removed from bubble
      createRemoveMemberUpdate(this.id);
    }
  },

  'click .uninvite': function(event) {
    event.stopPropagation();
    event.preventDefault();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    Bubbles.update({_id:currentBubbleId},
    {
      $pull: {'users.invitees': this.id}
    }, function(){
        $('#bubble-invitation').trigger({
          type: 'bubbleRefresh',
          sections: ['bubble', 'invitees'],
          timeout: 2000
        });
    });
    //Session.set(Session.get('currentBubbleId')+this._id,undefined);

    if(this.id != Meteor.userId()){
      //CREATE NEW UPDATE FUNCTION FOR UNINVITE
      createRemoveMemberUpdate(this.id);
    }
  }
});