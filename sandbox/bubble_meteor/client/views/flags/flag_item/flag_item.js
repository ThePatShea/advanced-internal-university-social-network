Template.flagItem.helpers({
	getPost: function() {
		return Posts.findOne(this.postId);
	}
});

