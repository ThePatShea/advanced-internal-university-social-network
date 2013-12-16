Template.connectBubble.helpers({
    connectWords : function() {
      if (this.users) {
        if (_.contains(this.users.admins, Meteor.userId()) || _.contains(this.users.members, Meteor.userId())){
          return "view bubble";
        }
        else if(_.contains(this.users.applicants, Meteor.userId())){
            return "cancel application";
        }
        else if(_.contains(this.users.invitees, Meteor.userId())){
          return "accept invite";
        }
        else{
          return "join bubble";
        }
      } else {
        return -1;
      }
    }
});

Template.connectBubble.events({
    'click .connect-bubble': function(evt) {
      // Disable the parent button
        evt.stopPropagation();
        evt.preventDefault();

        var that = this;

      // Add/remove the user to/from list of attendees
        //Meteor.call('attendEvent',this._id,Meteor.user().username);

      if(typeof this._id == 'undefined')
        this._id = this.id;

      if(_.contains(this.users.admins, Meteor.userId()) || _.contains(this.users.members, Meteor.userId())){
        Meteor.Router.to('/mybubbles/'+this._id+'/home');
      }
      else if(_.contains(this.users.applicants, Meteor.userId())){ //User has applied to bubble
        console.log('Trying to cancel');
        //Meteor.call('removeInvitee', this._id);
        Meteor.call('cancelJoinBubble', this._id);
      }
      else if(_.contains(this.users.invitees, Meteor.userId())){ //User has been invited to bubble
        Meteor.call('acceptInvitation', this._id);
      }
      else{
        console.log('Join Bubble: ', this._id);
        Meteor.call('sendApplicantEmail', Meteor.userId(), this._id);
        Meteor.call('joinBubble', this._id, function() {
          Meteor.Router.to('bubblePublicPage',that._id);
        });
      }
      
    
  
      // Track action on Google Analytics
        //Meteor.call('attendEvent',this._id,Meteor.user().username);
        //_gaq.push(['_trackEvent', 'Bubble', 'Apply', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Accept Invite', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Decline Invite', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Cancel Application', this.name]);
    },

    'click .deny-invite': function(evt){
      evt.stopPropagation();

      if(typeof this._id == 'undefined')
        this._id = this.id;

      var userId = Meteor.userId();
      Meteor.call('removeInvitee', this._id, userId, function() {
        window.location.href = window.location.pathname;
      });
    }
});
