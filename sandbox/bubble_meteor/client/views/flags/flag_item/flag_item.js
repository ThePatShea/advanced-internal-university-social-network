Template.flagItem.helpers({
	getPost: function() {
		return Posts.findOne(this.postId);
	},
	postLink: function(){
		if(typeof this.bubbleId != 'undefined'){
			return '/mybubbles/' + this.bubbleId + '/posts/' + this._id;
		}
		else if(typeof this.exploreId != 'undefined'){
			return '/explore/' + this.exploreId + '/posts/' + this._id;
		}
	}
});

