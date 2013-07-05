Meteor.users.allow({
	update: ownsProfile
});


Meteor.users.deny({
	update: function(userId, profileId, fieldNames){
		return (_.without(fieldNames, 'emails', 'phone','profilePicture', 'lastUpdated', 'userType').length > 0);
	}
});

if(Meteor.isServer){
	Accounts.onCreateUser(function(options, user) {
		if(user.username == 'campusbubble') {
			user.userType = 'megauser';
		}else{
			user.userType = 'user';
		}
		return user;
	});
}
