Meteor.users.allow({
	update: ownsProfile
});


Meteor.users.deny({
	update: function(userId, profileId, fieldNames){
		return (_.without(fieldNames, 'emails', 'phone', 'ppid', 'profilePicture', 'retinaProfilePicture', 'lastUpdated', 'userType', 'secret', 'neverLoggedIn').length > 0);
	}
});

if(Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {
		if(user.username == 'campusbubble') {
                        user.profilePicture = '/img/letterprofiles/c.jpg';
			user.userType = '4';
		}else{
			user.userType = '1';
		}
		return user;
	});
}
