Template.invitee.helpers({
	numPosts: function() {
		var uid = this._id;
		var numPosts = Posts.find({'userId': uid}).count();
		return numPosts;
	}
});

