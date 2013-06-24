Template.userprofileEdit.helpers({
	getProfile: function() {
		//console.log('get profile: ', Meteor.users.findOne({_id:Session.get('selectedUserId')}));
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getEmail: function(){
		return this.emails[0].address;
	}

});


Template.userprofileEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentProfileId = Session.get('selectedUserId');
    //var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();
    
    var profileProperties = {
      emails: [{'address': $(e.target).find('[name=email]').val(), 'verified': false}],
      lastUpdated: new Date().getTime()
    };
    //console.log(profileProperties);
    
    Meteor.users.update(currentProfileId, {$set: profileProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('userProfile', currentProfileId);
      }
    });

  },
  
});