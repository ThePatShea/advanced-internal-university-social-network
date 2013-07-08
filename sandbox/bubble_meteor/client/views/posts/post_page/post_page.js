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
  },
  getPostEditUrl: function() {
    if(this.postType == 'event'){
      return '/mybubbles/'+Session.get('currentBubbleId')+'/posts/'+Session.get('currentPostId')+'/edit/event';
    }else if(this.postType == 'discussion'){
      return '/mybubbles/'+Session.get('currentBubbleId')+'/posts/'+Session.get('currentPostId')+'/edit/discussion';
    }else if(this.postType == 'file'){
      return '/mybubbles/'+Session.get('currentBubbleId')+'/posts/'+Session.get('currentPostId')+'/edit/file';
    }
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
      var flag = Meteor.call('createFlag',flagAttributes);
      console.log(flag);
      //Creates the update when the flag object is created
      // Meteor.call('createPostFlagUpdate', );
    }
  }
});
