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

Meteor.publish("findUsersByName", function (username, currentUserId) {
  var search_name   =  new RegExp(username,'i');
  var search_query  =  {username: search_name};
  
  
  
  //TODO: Add in _id: {$nin: connected_users} (an array of all members/admins/invitees of that bubble)
  //exclude the members already in the bubble
  //Match.check(searchContent);
  var connected_users = Meteor.users.find(search_query, {
    fields: {
     'username': 1,
     'emails': 1
    }
  });  
  
//  var users = connected_users._find( { field: { $nin: [ "shaoqi1" ] } } );
  return Meteor.users.find(search_query, {
    fields: {
     'username': 1,
     'emails': 1
    }
  });
});

