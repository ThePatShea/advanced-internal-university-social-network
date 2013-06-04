// check that the userId specified owns the documents
ownsDocument = function(userId, doc) {
	var user = Meteor.users.findOne({_id: Meteor.user()._id});
	if (user.username == 'admin'){
		return doc && true;
	}else{
  	return doc && doc.userId === userId;
	}
}