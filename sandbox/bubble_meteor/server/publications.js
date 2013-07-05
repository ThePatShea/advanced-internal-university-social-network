getBubbleId =  function(userId) {
  if(userId){
    var bubbles = Bubbles.find({$or: [{'users.members': userId.toString()}, {'users.admins': userId.toString()}]});
    if(bubbles.count() > 0) {
      return _.pluck(bubbles.fetch(),'_id');
    }
  }
    return [];
}

//This publication only allows normal user to view posts
Meteor.publish('posts', function(bubbleId){
  return Posts.find({bubbleId: bubbleId});
});

//This Publication allows normal user to view all posts during searching
Meteor.publish('searchEvents', function(searchText, userId, limit) {
  return Posts.find(
    { postType:'event', 
      bubbleId: {$in: getBubbleId(userId)},
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}});
});
Meteor.publish('searchDiscussions', function(searchText, userId, limit) {
  return Posts.find(
    { postType:'discussion', 
      bubbleId: {$in: getBubbleId(userId)},
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}});
});
Meteor.publish('searchFiles', function(searchText, userId, limit) {
  return Posts.find(
    { postType:'file', 
      bubbleId: {$in: getBubbleId(userId)},
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}});
});

//This Publication allows super to view all posts during searching
Meteor.publish('superSearchEvents', function(searchText, searchText, limit){
  return Posts.find(
    { postType: 'event',
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}, limit:limit});
});
Meteor.publish('superSearchDiscussions', function(searchText, limit){
  return Posts.find(
    { postType: 'discussion',
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}, limit:limit});
});
Meteor.publish('superSearchFiles', function(searchText, limit){
  return Posts.find(
    { postType: 'file',
      $or: [
        {name: new RegExp(searchText,'i')}, 
        {body: new RegExp(searchText,'i')}, 
        {file: new RegExp(searchText,'i')}, 
        {location: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}, limit:limit});
});

Meteor.publish('comments', function(postId, limit) {
  return Comments.find({postId: postId}, {sort: {submitted:-1}});
});

Meteor.publish('updates', function(userId) {
  return Updates.find({read: false}, {sort: {submitted:1}});
});

Meteor.publish('singleBubble', function(id){
	return id && Bubbles.find(id);
});

Meteor.publish('bubbles', function(limit) {
  return Bubbles.find({}, {sort: {submitted: -1}, limit:limit});
});

Meteor.publish('searchBubbles', function(searchText,limit) {
  return Bubbles.find(
    { $or: [
        {title: new RegExp(searchText,'i')}, 
        {description: new RegExp(searchText,'i')}
      ]
    }, {sort: {submitted: -1}, limit:limit});
});

Meteor.publish('joinedBubbles', function(userId) {
  return Bubbles.find({$or: [{'users.members': userId},{'users.admins': userId}]}, {sort: {submitted: -1}});
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
       'emails': 1,
       'userType': 1
      }
    });
  }
});

Meteor.publish("findUsersByName", function(username, limit) {
  var search_name = new RegExp(username,'i');
  var search_query = {username: search_name};
    
  return Meteor.users.find(search_query, {
    fields: {
     'username': 1,
     'emails': 1,
     'userType': 1
    }
  });
});

Meteor.publish('userData', function(userId) {
  return Meteor.users.find({_id: userId},{
    fields: {
     'username': 1,
     'emails': 1,
     'userType': 1
    }
  });
});


Meteor.publish(null, function() {
  return Meteor.users.find({}, {fields: {'profilePicture': 1}});
});

