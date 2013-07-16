Template.connectBubble.helpers({
    connectWords : function() {
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
      
    }
});

Template.imGoing.events({
    'click .connect-bubble': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Add/remove the user to/from list of attendees
        //Meteor.call('attendEvent',this._id,Meteor.user().username);

      if (_.contains(this.users.admins, Meteor.userId()) || _.contains(this.users.members, Meteor.userId())){ //User belongs to bubble
        //Meteor.call('attendEvent',this._id,Meteor.user().username);
      }
      else if(_.contains(this.users.applicants, Meteor.userId())){ //User has applied to bubble
          return "cancel application";
      }
      else if(_.contains(this.users.invitees, Meteor.userId())){ //User has been invited to bubble
        return "accept invite";
      }
      else{
        return "join bubble";
      }
      
    
  
      // Track action on Google Analytics
        //Meteor.call('attendEvent',this._id,Meteor.user().username);
        //_gaq.push(['_trackEvent', 'Bubble', 'Apply', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Accept Invite', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Decline Invite', this.name]);
        //_gaq.push(['_trackEvent', 'Bubble', 'Cancel Application', this.name]);
    },

    'click .deny-invite': function(){
      event.stopPropagation();
      var userId = Meteor.userId();
      Meteor.call('removeInvitee', this._id, userId);
    }
});
