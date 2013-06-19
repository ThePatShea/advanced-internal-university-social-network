Template.postPage.helpers({
  currentPost: function() {
    return Posts.findOne(Session.get('currentPostId'));
  },
  isEvent: function() {
  	if(this.postType == 'event'){
  		return true;
  	}
  },
  numOfAttendees: function() {
  	return this.attendees.length;
  },
  isAttending: function() {
  	return _.contains(this.attendees,Meteor.users.findOne().username);
  },
  notAttending: function() {
    return !_.contains(this.attendees,Meteor.users.findOne().username);
  }

});

Template.postPage.events({
	'click .btn': function(event){
		event.preventDefault();
		
		Meteor.call('attendEvent',this._id,Meteor.users.findOne().username);

  }
});
