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
  // return Updates.find({$or: [{invokerId:this.userId},{userId:this.userId}], read: false}, {sort: {submitted:1}});
});

Meteor.publish('singleBubble', function(id){
	return id && Bubbles.find(id);
});

Meteor.publish('bubbles', function(limit) {
  return Bubbles.find({}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('joinedBubbles', function(userId, limit) {
  return Bubbles.find({$or: [{'users.members': userId},{'users.admins': userId}]}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('invitedBubbles', function(userId) {
  return Bubbles.find({'users.invitees':userId});
});

Meteor.publish('relatedUsers', function(bubbleId, postId, usernameList) {
  if (!usernameList) {
    usernameList = [];
  }
  var bubble = Bubbles.findOne(bubbleId);
  if(!bubble) {
    var post = Posts.findOne(postId);
    if(post) {
      bubble = Bubbles.findOne(post.bubbleId);
    }
  }
  if(bubble){
    var users = bubble.users;
    var userList = [];
    userList = userList.concat(users.admins)
                    .concat(users.invitees)
                    .concat(users.members)
                    .concat(users.applicants);
                    
    return Meteor.users.find({$or: [{_id: {$in: userList}},{username: {$in: usernameList}}]}, {
      fields: {
       'username': 1,
       'emails': 1
      }
    });
  }
})

Meteor.publish("findUsersByName", function (username) {
  var search_name = new RegExp(username,'i');
  var search_query = {username: search_name};
    
  return Meteor.users.find(search_query, {
    fields: {
     'username': 1,
     'emails': 1
    }
  });
});

// Meteor.publish('shortlistedUsers', function(usernameList) {
//   if(usernameList){
//     return Meteor.users.find({username: {$in: usernameList}},{
//       fields: {
//         'username': 1,
//         'emails': 1
//       }
//     });
//   }
// });

