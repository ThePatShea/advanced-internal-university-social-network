Meteor.publish('posts', function(limit) {
  return Posts.find({}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('singlePost', function(id) {
  return id && Posts.find(id);
});

Meteor.publish('comments', function(postId) {
  return Comments.find({postId: postId}, {sort: {submitted:-1}});
});

Meteor.publish('updates', function() {
  return Updates.find({userId: this.userId, read: false}, {sort: {submitted:1}});
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

Meteor.publish("findUsersByName", function (username, bubbleId) {
  var search_name   =  new RegExp(username,'i');

  //Retrieve list of users who should not be retrieved
  var users = Bubbles.findOne(bubbleId).users;
  var rejectList = [];
  rejectList = rejectList.concat(users.admins);
  rejectList = rejectList.concat(users.invitees);
  rejectList = rejectList.concat(users.members);
  rejectList = rejectList.concat(users.applicants);

  var search_query  =  {username: search_name};
  
  return Meteor.users.find(search_query, {username: {$nin:rejectList}}, {
    fields: {
     'username': 1,
     'emails': 1
    }
  });
});

