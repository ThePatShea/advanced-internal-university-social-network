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
	// invokerNameIs: function(){
	// 	Session.set('selectedUser',this.invokerId);
	// 	return Meteor.users.findOne(this.invokerId).username.toUpperCase();
	// }
});