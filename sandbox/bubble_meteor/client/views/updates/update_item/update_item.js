Template.updateItem.helpers({
	getPost: function(postId){
		return Posts.findOne(postId);
	},
	updateTypeIs: function(){
		var updateType = this.updateType;
		if (updateType == "newPost") {
			return "POSTED";
		} else if (updateType == "newComment") {
			return "REPLIED ON";
		} else if (updateType == "newMember") {
			return "JOINED";
		}
	},
	getNewCommentsCount: function(postId){
		return Updates.find({postId:postId, updateType:'newComment', read:false}).count();
	}
});

Template.updateItem.events({
  'click a': function() {
    Updates.update({postId:this.postId, updateType:this.updateType}, {$set: {read: true}});
  }
})