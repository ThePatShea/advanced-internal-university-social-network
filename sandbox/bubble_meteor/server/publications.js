Meteor.publish('posts', function(limit) {
  return Posts.find({}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});

Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId});
});

Meteor.publish('updates', function() {
  return Updates.find({userId: this.userId});
});

Meteor.publish('bubbles', function(){
	return Bubbles.find();
})