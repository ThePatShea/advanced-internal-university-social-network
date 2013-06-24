// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
	return doc && doc.userId === userId;
}

ownsUpdate = function(userId, doc) {
	return doc && doc.invokerId === userId;
}

ownsProfile = function(userId, profile) {
	console.log(userId, profile._id);
	return (userId === profile._id);
}