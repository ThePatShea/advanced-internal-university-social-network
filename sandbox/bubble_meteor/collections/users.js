Meteor.users.allow({
	update: ownsProfile
});


Meteor.users.deny({
	update: function(userId, profileId, fieldNames){
		return (_.without(fieldNames, 'intercomHashedId', 'emails', 'phone', 'ppid', 'profilePicture', 'retinaProfilePicture', 'lastUpdated', 'userType', 'secret', 'neverLoggedIn', 'neverOnboarded', 'deviceToken').length > 0);
	}
});

if (Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {
		//Create a hashed userid for intercom
		var hmac = crypto.createHmac('sha256', Meteor.settings.INTERCOM_APP_SECRET);
		user.intercomHashedId = hmac.update(user._id).digest('hex');

		
		if(user.username == 'campusbubble') {
      user.profilePicture = '/img/letterprofiles/c.jpg';
			user.userType = '4';
		} else if (user.username == 'emorybubble') {
                        user.profilePicture = '/img/letterprofiles/e.jpg';
                        user.name = 'Emory Bubble';
			user.userType = '1';
		} else {
			user.userType = '1';
		}
		user.createAt = new Date().getTime();
		return user;
	});
}
