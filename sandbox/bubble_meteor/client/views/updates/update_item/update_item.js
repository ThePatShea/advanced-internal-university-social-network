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
  	var updatesList = Updates.find({postId: this.postId, read:false}).collection.docs;
  	Meteor.call('setRead', updatesList);
  }
})