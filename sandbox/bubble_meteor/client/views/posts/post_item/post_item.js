Template.postItem.helpers({
  getPostEditUrl: function(post) {
  	if(post.postType == 'discussion') {
  		return '/mybubbles/' + post.bubbleId + '/posts/' + post._id + '/edit/discussion';
  	}else if(post.postType == 'event') {
  		return '/mybubbles/' + post.bubbleId + '/posts/' + post._id + '/edit/event';
  	}else if(post.postType == 'file') {
  		return '/mybubbles/' + post.bubbleId + '/posts/' + post._id + '/edit/file';
  	}
  }

});

Template.postItem.events({
  'click .upvoteable': function(event) {
    event.preventDefault();
    Meteor.call('upvote', this._id);
  }
});
