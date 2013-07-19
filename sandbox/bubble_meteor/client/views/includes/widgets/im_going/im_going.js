Template.imGoing.helpers({
    mainWords : function() {
      if (_.contains(this.attendees,Meteor.userId()))
        return "not going"
      else
        return "i'm going"
    }
});

Template.imGoing.events({
    'click .im-going': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Add/remove the user to/from list of attendees
        Meteor.call('attendEvent',this._id,Meteor.userId());
  
      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Attending Event', this.name]);
    }
});





Template.imGoingSmall.helpers({
    mainWords : function() {
      if (_.contains(this.attendees,Meteor.userId()))
        return "not going"
      else
        return "i'm going"
    }
});

Template.imGoingSmall.events({
    'click .im-going': function(event) {
      // Disable the parent button
        event.stopPropagation();

      // Add/remove the user to/from list of attendees
        Meteor.call('attendEvent',this._id,Meteor.userId());
  
      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Attending Event', this.name]);
    }
});
