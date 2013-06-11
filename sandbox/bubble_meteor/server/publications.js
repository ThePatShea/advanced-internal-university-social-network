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
});

Meteor.publish("findOneUser", function (userId) {
  return Meteor.users.find({_id:userId}, {
   	fields: {
     'username': 1,
     'emails': 1
		}
	});
});