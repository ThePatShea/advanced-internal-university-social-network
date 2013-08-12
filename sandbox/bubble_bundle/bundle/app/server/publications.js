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
  Meteor.publish('updatedPosts', function(userId) {
    var updates = Updates.find({userId: userId, read: false}).fetch();
    var postsList = _.pluck(updates,'postId');
    return Posts.find({_id: {$in: postsList}});
  });
  Meteor.publish('events', function(bubbleId, limit){
    return Posts.find({bubbleId: bubbleId, postType: 'event'}, {
      sort: {submitted: -1},
      limit: limit,
      fields: {
        'file': 0,
        'eventPhoto': 0,
        'retinaEventPhoto': 0
      }
    });
  });
  Meteor.publish('discussions', function(bubbleId, limit){
    return Posts.find({bubbleId: bubbleId, postType: 'discussion'}, {
      sort: {submitted: -1},
      limit: limit,
      fields: {
        'file': 0,
        'eventPhoto': 0,
        'retinaEventPhoto': 0
      }
    });
  });
  Meteor.publish('files', function(bubbleId, limit){
    return Posts.find({bubbleId: bubbleId, postType: 'file'}, {
      sort: {submitted: -1},
      limit: limit,
      fields: {
        'file': 0,
        'eventPhoto': 0,
        'retinaEventPhoto': 0
      }
    });
  });
  //This publication only returns posts that are flagged
  Meteor.publish('flaggedPosts', function(limit){
    var flags = Flags.find().fetch();
    var postsList = _.pluck(flags, 'postId');
    return Posts.find({_id: {$in: postsList}}, {
      sort: {submitted: -1},
      limit: limit,
      fields: {
        'file': 0,
        'eventPhoto': 0,
        'retinaEventPhoto': 0
      }
    });
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
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
  Meteor.publish('searchDiscussions', function(searchText, userId, limit) {
    return Posts.find(
      { postType:'discussion', 
        bubbleId: {$in: getBubbleId(userId)},
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
  Meteor.publish('searchFiles', function(searchText, userId, limit) {
    return Posts.find(
      { postType:'file', 
        bubbleId: {$in: getBubbleId(userId)},
        $or: [
          {name: new RegExp(searchText,'i')},
          {file: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
//This Publication allows lvl3 to view all posts during searching
  Meteor.publish('lvl3SearchEvents', function(searchText, limit){
    return Posts.find(
      { postType: 'event',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}, 
          {location: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
  Meteor.publish('lvl3SearchDiscussions', function(searchText, limit){
    return Posts.find(
      { postType: 'discussion',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {body: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
  Meteor.publish('lvl3SearchFiles', function(searchText, limit){
    return Posts.find(
      { postType: 'file',
        $or: [
          {name: new RegExp(searchText,'i')}, 
          {file: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'file': 0,
          'eventPhoto': 0,
          'retinaEventPhoto': 0
        }
      });
  });
  Meteor.publish('singlePost', function(postId) {
    return postId && Posts.find(postId);
  });



// Comments Related Publications
  Meteor.publish('comments', function(postId, limit) {
    return Comments.find({postId: postId}, {sort: {submitted:-1}, limit: limit});
  });

  Meteor.publish('userComments', function(userId){
    return Comments.find({'userId': userId});
  });


// Updates Related Publications 
  Meteor.publish('updates', function(userId) {
    return Updates.find({userId: userId, read: false}, {sort: {submitted:1}});
  });


// Bubbles Related Publications
  Meteor.publish('singleBubble', function(bubbleId){
  	return bubbleId && Bubbles.find(bubbleId);
  });
  Meteor.publish('bubbles', function(limit) {
    return Bubbles.find({}, {
      sort: {submitted: -1}, 
      limit: limit,
      fields: {
        'coverPhoto': 0,
        'retinaCoverPhoto': 0,
        'profilePicture': 0, 
        'retinaProfilePicture': 0
      }
    });
  });
  Meteor.publish('searchBubbles', function(searchText,limit) {
    return Bubbles.find(
      { $or: [
          {title: new RegExp(searchText,'i')}, 
          {description: new RegExp(searchText,'i')}
        ]
      }, {
        sort: {submitted: -1}, 
        limit: limit,
        fields: {
          'coverPhoto': 0,
          'retinaCoverPhoto': 0,
          'profilePicture': 0, 
          'retinaProfilePicture': 0
        }
      });
  });
  Meteor.publish('joinedBubbles', function(userId, limit) {
    return Bubbles.find({
      $or: [{
        'users.members': userId}, 
        {'users.admins': userId}
        ]}, {
      sort: {submitted: -1}, 
      limit: limit,
      fields: {
        'coverPhoto': 0,
        'retinaCoverPhoto': 0,
        'profilePicture': 0, 
        'retinaProfilePicture': 0
      }
    });
  });
  Meteor.publish('invitedBubbles', function(userId, limit) {
    return Bubbles.find({'users.invitees':userId}, {
      sort: {submitted: -1}, 
      limit: limit,
      fields: {
        'coverPhoto': 0,
        'retinaCoverPhoto': 0,
        'profilePicture': 0, 
        'retinaProfilePicture': 0,
        'profilePicture': 0
      }
    });
  });

// Meteor Explores Related Publications
  Meteor.publish('allExplores', function(){
    return Explores.find({}, {fields:
      {
        'title': 1,
        'description': 1,
        'exploreIcon': 1,
        'category': 1,
        'coverPhoto': 1, 
        'retunaCoverPhoto': 1
      }
    });
  });

// Meteor Users Related Publications
  Meteor.publish('allUsers', function(){
    //var user = Meteor.users.findOne({_id: UserId});
    return Meteor.users.find({}, {
      fields: {
       'username': 1,
       'emails': 1,
       'userType': 1,
       'lastActionTimestamp': 1,
       'profilePicture': 1
      }
    });
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
      userList = userList.concat(users.admins, users.invitees, users.members, users.applicants);
                      
      return Meteor.users.find({$or: [{_id: {$in: userList}},{username: {$in: usernameList}}]}, {
        fields: {
         'username': 1,
         'emails': 1,
         'userType': 1,
         'lastActionTimestamp': 1,
         'profilePicture': 1
        }
      });
    }
  });
  Meteor.publish("findUsersByName", function(username, limit) {
    var search_name = new RegExp(username,'i');
    var search_query = {username: search_name, userType: {$nin: ['4']}};
    return Meteor.users.find(search_query, {
      fields: {
       'username': 1,
       'emails': 1,
       'userType': 1,
       'lastActionTimestamp': 1,
       'profilePicture': 1
      }
    });
  });
  Meteor.publish('findUsersById', function(userIdList) {
    if(userIdList){
      return Meteor.users.find({_id: {$in: userIdList}}, {
        fields: {
         'username': 1,
         'emails': 1,
         'userType': 1,
         'lastActionTimestamp': 1,
         'profilePicture': 1
        }
      });
    }
  });
  Meteor.publish('singleUser', function(userId) { 
    return Meteor.users.find({_id: userId}, {
      fields: {
       'username': 1,
       'emails': 1,
       'userType': 1,
       'lastActionTimestamp': 1,
       'phone': 1,
       'profilePicture': 1,
       'retinaProfilePicture': 1,
       'lastUpdated': 1
      }
    });
  });
  Meteor.publish('authenticatedUser', function(secret){
    return Meteor.users.find({'secret': secret}, {
      fields: {
        'username': 1,
        'secret': 1
      }
    });
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
