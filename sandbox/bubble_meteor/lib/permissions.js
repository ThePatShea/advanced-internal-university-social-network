ownsUpdate = function(userId, doc) {
	return doc && doc.invokerId === userId;
}

ownsProfile = function(userId, profile) {
	return 'megauser' == Meteor.user().userType || userId === profile._id;
}

ownsPost = function(userId, doc) {
	var bubble = Bubbles.findOne(doc.bubbleId);
	return ('superuser' == Meteor.user().userType 
		|| doc.author == Meteor.user().username
		|| _.contains(bubble.users.admins,Meteor.userId()));
}

ownsBubble = function(userId, doc, onChange) {
	return true;
	//Feature is currently on hold
	// return ('superuser' == Meteor.user().userType || _.contains(doc.users.admins, Meteor.user().username));
}
