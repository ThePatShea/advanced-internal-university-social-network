Meteor.users.allow({
	update: ownsProfile
});


Meteor.users.deny({
	update: function(userId, profileId, fieldNames){
		return (_.without(fieldNames, 'emails', 'profilePicture', 'lastUpdated').length > 0);
	}
});