Template.postPage.helpers({
  currentPost: function() {
    console.log('currentPost: ', Session.get('currentPostId'));
    return Posts.findOne(Session.get('currentPostId'));
  },
  isEvent: function() {
  	return this.postType == 'event';
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
      if(typeof this.parent != 'undefined'){
        return '/mybubbles/' + Session.get('currentBubbleId') + '/posts/' + this.parent + '/edit/discussion';
      }
      else{
        return '/mybubbles/'+Session.get('currentBubbleId')+'/posts/'+Session.get('currentPostId')+'/edit/file';
      }
    }
  }
});

Template.postPage.events({
	'click .attending': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Post', 'Attending Event', +this.name]);
		Meteor.call('attendEvent',this._id,Meteor.user().username);

  },
  'click .flag': function() {
    //Google Analytics
    _gaq.push(['_trackEvent', 'Flagging', 'Flag', +this.name]);
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
