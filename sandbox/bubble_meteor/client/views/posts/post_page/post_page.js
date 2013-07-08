Template.postPage.helpers({
  currentPost: function() {
    return Posts.findOne(Session.get('currentPostId'));
  },
  isEvent: function() {
  	return this.postType == 'event';
  },
  numOfAttendees: function() {
  	return this.attendees.length;
  },
  isAttending: function() {
  	return _.contains(this.attendees,Meteor.user().username);
  },
  notAttending: function() {
    return !_.contains(this.attendees,Meteor.user().username);
  }
});

Template.postPage.events({
	'click .attending': function() {
		Meteor.call('attendEvent',this._id,Meteor.user().username);

  },
  'click .flag': function() {
    if (confirm("Flag this post?")) {
      var flagAttributes = {
        postId: this._id,
        bubbleId: this.bubbleId,
        invokerId: Meteor.userId(),
        invokerName: Meteor.user().username,
      }
      Meteor.call('createFlag',flagAttributes);
    }
  }
});
