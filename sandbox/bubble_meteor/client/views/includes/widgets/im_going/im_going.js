Template.imGoing.helpers({
    hoverWords : function() {
      if (_.contains(this.attendees,Meteor.user().username))
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
        Meteor.call('attendEvent',this._id,Meteor.user().username);
  
      // Track action on Google Analytics
        _gaq.push(['_trackEvent', 'Post', 'Attending Event', +this.name]);
    }
});
