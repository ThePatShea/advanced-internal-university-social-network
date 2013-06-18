Template.bubbleInvitation.events({
  'submit form': function(e) {
    e.preventDefault();
		
		//console.log(this.searchContent); //the searchContent is not saved yet
		//but the content is stored into session
		//how to store it????
		Session.set('selectedUsername', $(e.target).find('[name=title]').val());
  },
});

Template.bubbleInvitation.helpers({

	findUsers: function(username){
	  //var users = Meteor.users.find({username:username});
	  return Session.get('selectedUsername'); //all the users are found
	},
	
	getSearchText: function(){
		console.log(this.searchContent);
		return this.searchContent;
	},
	
	getSelectedUsers: function(){
		//return Meteor.users.find({username:Session.get('selectedUsername')});
		//Meteor.users.find({username:Session.get('selectedUsername')});
		
		//console.log(Meteor.users.find({username:Session.get('selectedUsername')}).fetch());
		return Meteor.users.find();
	}

});

Template.selectedUserItem.helpers({
	
	getSelectedUser: function(){
		return "Andy"; 
	}
})



