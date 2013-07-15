// This method returns a list of bubbleIds of the bubble that the user belongs to
getBubbleId =  function(userId) {
  if(userId){
    var bubbles = Bubbles.find({$or: [{'users.members': userId.toString()}, {'users.admins': userId.toString()}]});
    if(bubbles.count() > 0) {
      return _.pluck(bubbles.fetch(),'_id');
    }
  }
  return [];
}


// Posts Related Publications 
  //This publication only allows normal user to view posts
  Meteor.publish('posts', function(bubbleId, limit){
    return Posts.find({bubbleId: bubbleId}, {limit: limit});
  });
  //This publication only returns posts that are flagged
  Meteor.publish('flaggedPosts', function(limit){
    var flags = Flags.find().fetch();
    var postsList = _.pluck(flags, 'postId');
    return Posts.find({_id: {$in: postsList}}, {limit: limit}});
  })
  //This Publication allows normal user to view all posts during searching
  Meteor.publish('searchEvents', function(searchText, userId, limit) {
    return Posts.find(
      { postType:'event', 
        bubbleId: {$in: getBubbleId(userId)},
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}, 
          {location: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit: limit});
  });
  Meteor.publish('searchDiscussions', function(searchText, userId, limit) {
    return Posts.find(
      { postType:'discussion', 
        bubbleId: {$in: getBubbleId(userId)},
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit: limit});
  });
  Meteor.publish('searchFiles', function(searchText, userId, limit) {
    return Posts.find(
      { postType:'file', 
        bubbleId: {$in: getBubbleId(userId)},
        $or: [
          {name: new RegExp(searchText,'i')},
          {file: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit: limit});
  });
//This Publication allows super to view all posts during searching
  Meteor.publish('superSearchEvents', function(searchText, limit){
    return Posts.find(
      { postType: 'event',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}, 
          {location: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit:limit});
  });
  Meteor.publish('superSearchDiscussions', function(searchText, limit){
    return Posts.find(
      { postType: 'discussion',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit:limit});
  });
  Meteor.publish('superSearchFiles', function(searchText, limit){
    return Posts.find(
      { postType: 'file',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {file: new RegExp(searchText,'i')}
        ]
      }, {sort: {submitted: -1}, limit:limit});
  });



// Comments Related Publications
  Meteor.publish('comments', function(postId, limit) {
    return Comments.find({postId: postId}, {sort: {submitted:-1}, limit: limit});
  });


// Updates Related Publications 
  Meteor.publish('updates', function(limit) {
    return Updates.find({read: false}, {sort: {submitted:1}, limit: limit});
  });


// Bubbles Related Publications
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
  Meteor.publish('joinedBubbles', function(userId, limit) {
    return Bubbles.find({$or: [{'users.members': userId},{'users.admins': userId}]}, {sort: {submitted: -1}, limit});
  });
  Meteor.publish('invitedBubbles', function(userId, limit) {
    return Bubbles.find({'users.invitees':userId}, {limit: limit});
  });


// Meteor Users Related Publications 
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
      userList = userList.concat(users.admins, users.invitees, users.members, users.applicants);
                      
      return Meteor.users.find({$or: [{_id: {$in: userList}},{username: {$in: usernameList}}]}, {
        fields: {
         'username': 1,
         'emails': 1,
         'userType': 1,
         'profilePicture': -1,
       'lastActionTimestamp': new Date().getTime()
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
       'userType': 1,
       'profilePicture': -1,
       'lastActionTimestamp': new Date().getTime()
      }
    });
  });

  Meteor.publish('userData', function(userIdList) {
    if(userIdList){
      //Remove null from the userIdList 
      userIdList = _.reject(userIdList, function(userId){
        return null;
      });
      
      return Meteor.users.find({_id: {$in: userIdList}}, {
        fields: {
         'username': 1,
         'emails': 1,
         'userType': 1,
         'profilePicture': -1,
         'lastActionTimestamp': new Date().getTime()
        }
      });
    }
  });


// Flags Related Publications
  Meteor.publish('solvedFlags', function(limit) {
    return Flags.find({solved: true}, {limit: limit});
  });
  Meteor.publish('unsolvedFlags', function(limit) {
    return Flags.find({solved: false}, {limit: limit});
  });
  Meteor.publish('allFlags', function(limit) {
    return Flags.find({}, {limit: limit});
  });


// UserLog Related Publications
  Meteor.publish('currentUserlogs', function(userId, limit) {
    return Userlogs.find({userId: userId}, {limit: limit});
  });
  Meteor.publish('allUserlogs', function(limit) {
    return Userlogs.find({}, {limit: limit});
  });
