Template.commentItem.helpers({
	allowDelete: function() {
		var post = Posts.findOne(Session.get('currentPostId'));
		var bubble = Bubbles.findOne(post.bubbleId);
		if (bubble) {
			var admins = bubble.users.admins;
			if(Meteor.userId()) {
				var userId = Meteor.userId();
				if(userId == post.userId || userId == this.userId || _.contains(admins, userId)) {
					return true;
				}else{
					return false;
				}
			}
		}
	}
});

Template.commentItem.events({
	'click .delete-comment': function(event){
		event.preventDefault();
		if (confirm("Delete this comment?")) {
			Meteor.call('deleteComment', this._id);
    }
  }
});