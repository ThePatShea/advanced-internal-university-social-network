ownsUpdate = function(userId, doc) {
	return doc && doc.invokerId === userId;
}

ownsProfile = function(userId, profile) {
	console.log(userId, profile._id);
	return (userId === profile._id);
}

