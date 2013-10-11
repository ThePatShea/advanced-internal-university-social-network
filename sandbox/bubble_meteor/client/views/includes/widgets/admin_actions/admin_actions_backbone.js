Template.adminActionsBackbone.created = function(){

  currentBubbleId = window.location.pathname.split("/")[2];

  adminDep = new Deps.Dependency;


  mybubbles = new BubbleData.MyBubbles({
    bubbleId: currentBubbleId,
    limit: 1,
    fields: ['title', 'profilePicture', 'category', 'bubbleType'],

    events: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'attendees', 'viewCount', 'userId']
    },

    discussions: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
    },

    files: {
      limit: 1,
      fields: ['name', 'author', 'submitted', 'postType', 'bubbleId', 'dateTime', 'commentsCount', 'viewCount', 'userId']
    },

    members: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    admins: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    applicants: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    invitees: {
      limit: 1,
      fields: ['username', 'name', 'profilePicture', 'userType']
    },

    callback: function(){
      console.log('Bubbledata changed');
      adminDep.changed();
      Session.set('isLoading', false);
    }
  });
}


Template.adminActionsBackbone.helpers({
  getAdminStatus: function() {
    //return Bubbles.find({'users.admins': this._id, '_id': Session.get('currentBubbleId')}).count();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isAdmin(this.id);
  },

  getApplicantStatus: function() {
	 //return Bubbles.find({'users.applicants': this._id, '_id': Session.get('currentBubbleId')}).count();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isApplicant(this.id);
  },

  getMemberStatus: function() {
	 //return Bubbles.find({'users.members': this._id, '_id': Session.get('currentBubbleId')}).count();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isMember(this.id);
  },

  getInviteeStatus: function() {
   //return Bubbles.find({'users.invitees': this._id, '_id': Session.get('currentBubbleId')}).count();

    if(typeof this.id == 'undefined'){
      this.id = this._id;
    }

    return mybubbles.isInvitee(this.id);
  }
});

Template.adminActionsBackbone.events({
	'click .demote-admin': function(event){
	// Disable the parent button
    event.stopPropagation();
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    var admins = bubble.users.admins;

    if(admins.length > 1){
      Bubbles.update({_id:Session.get('currentBubbleId')},
      {
        $addToSet: {'users.members': this._id},
        $pull: {'users.admins': this._id}
      });
      createAdminDemoteUpdate(this._id);
    }else{
      alert("You are the last remaining admin. Please promote another member before demoting yourself.");
    }
  },

  //This happens when admin leaves the bubble
  'click .remove-admin': function(event) {
  	// Disable the parent button
    event.stopPropagation();
    var bubble = Bubbles.findOne(Session.get('currentBubbleId'));
    var admins = bubble.users.admins;
    var members = bubble.users.members;
    var count = admins.length + members.length
    if(count > 1){
      Bubbles.update({_id:Session.get('currentBubbleId')},
      {
        $pull: {'users.admins': this._id}
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
        }
      }
    }else{
      if(confirm("You are the last remaining member.  Removing yourself will delete this bubble.  Are you sure you want to delete this bubble?"))
      {
        var updates = Updates.find({bubbleId: Session.get('currentBubbleId')}, {read:false}).fetch();
        _.each(updates, function(update){
          Updates.update({_id: update._id}, {read:true});
        });
        Bubbles.remove({_id:Session.get('currentBubbleId')});

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
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.members': this._id},
      $pull: {'users.applicants': this._id}
    });

    //Create update to inform user about accpeted application
    createNewMemberUpdate(this._id);
  },

  'click .deny': function(event){
    event.stopPropagation();
    event.preventDefault();
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.applicants': this._id}
    });

    //Create update to inform user about rejected application
    createRejectApplicationUpdate(this._id);
  },

  'click .promote-member': function(event) {
    event.stopPropagation();
    event.preventDefault();
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $addToSet: {'users.admins': this._id},
      $pull: {'users.members': this._id}
    });
    Session.set(Session.get('currentBubbleId')+this._id,undefined);

    //Create update for member who is promoted
    createMemberPromoteUpdate(this._id);
  },

  'click .remove-member': function(event) {
    event.stopPropagation();
    event.preventDefault();
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.members': this._id}
    });
    Session.set(Session.get('currentBubbleId')+this._id,undefined);

    if(this._id != Meteor.userId()){
      //Create update for member who is removed from bubble
      createRemoveMemberUpdate(this._id);
    }
  },

    'click .uninvite': function(event) {
    event.stopPropagation();
    event.preventDefault();
    Bubbles.update({_id:Session.get('currentBubbleId')},
    {
      $pull: {'users.invitees': this._id}
    });
    Session.set(Session.get('currentBubbleId')+this._id,undefined);

    if(this._id != Meteor.userId()){
      //CREATE NEW UPDATE FUNCTION FOR UNINVITE
      createRemoveMemberUpdate(this._id);
    }
  }
});