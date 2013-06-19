Template.bubbleInvitation.events({
  'submit form': function(e) {
    e.preventDefault();
    //store the content into the session
		Session.set('selectedUsername', $(e.target).find('[name=title]').val()); 
    Session.set('currentUserId', Meteor.userId());
  },	
});

Template.bubbleInvitation.helpers({
	findUsers: function(){
	  return Meteor.users.find();
	}
});






