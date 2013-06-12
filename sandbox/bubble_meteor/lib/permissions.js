// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
	return doc && doc.userId === userId;
}

ownsUpdate = function(userId, doc) {
	return doc && doc.invokerId === userId;
}