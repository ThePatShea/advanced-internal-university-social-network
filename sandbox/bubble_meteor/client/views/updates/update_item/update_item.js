Template.updateItem.helpers({
	getPostName: function(postId){
		var post = Posts.findOne(postId);

		if (post) {
			return post.name;
		}
	},
	getCommentsCount: function(postId){
		return Comments.find({postId:postId}).count();
	}
});