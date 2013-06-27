ownsUpdate = function(userId, doc) {
	return doc && doc.invokerId === userId;
}

ownsProfile = function(userId, profile) {
	console.log(userId, profile._id);
	return (userId === profile._id);
}

ownsDocument = function(userId, doc) {
	var user = Meteor.users.findOne({_id: userId});
	return (doc.author == user.username);
}

