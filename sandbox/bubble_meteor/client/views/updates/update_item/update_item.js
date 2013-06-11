Template.updateItem.helpers({
	getPost: function(postId){
		return Posts.findOne(postId);
	}
});