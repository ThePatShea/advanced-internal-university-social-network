Posts = new Meteor.Collection('posts');

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'name', 'body', 'dateTime', 'location', 'file', 'fileType', 'lastUpdated').length > 0);
  }
});

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user();
    var bubble = Bubbles.findOne(postAttributes.bubbleId);
    // console.log(user._id);
    
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to post new stories");
    
    // ensure the post has all of its fields filled in
    if ( postAttributes.postType == 'discussion' && (!postAttributes.name || !postAttributes.body) ) {
      throw new Meteor.Error(422, 'Please fill in all fields');
    } else if ( postAttributes.postType == 'event' && (!postAttributes.name || !postAttributes.body || !postAttributes.location || !postAttributes.dateTime) ) {
      throw new Meteor.Error(422, 'Please fill in all fields');
    } else if ( postAttributes.postType == 'file' && (!postAttributes.name || !postAttributes.file) ) {
      throw new Meteor.Error(422, 'Please fill in all fields');
    }

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'postType', 'name', 'body', 'file', 'fileType', 'dateTime', 'location', 'bubbleId', 'attendees'), {
      userId: user._id, 
      author: user.username, 
      submitted: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      commentsCount: 0,
      upvoters: [],
      attendees: 0, 
      votes: 0
    });

    post._id = Posts.insert(post);
    createPostUpdate(post);

    return post._id;
  },

  upvote: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to upvote");
    
    Posts.update({
      _id: postId, 
      upvoters: {$ne: user._id}
    }, {
      $addToSet: {upvoters: user._id},
      $inc: {votes: 1}
    });
  },

  tagBubble: function(postId, bubbleId) {
    var user = Meteor.user();
    var bubble = Bubble.findOne({bubbleId:bubbleId});
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login to add a Bubble to this post");
    
    Posts.update({
      _id: postId
    }, {
      $addToSet: {bubble: bubble._id}
    });
  },

  attendEvent: function(postId,username){
    post = Posts.findOne(postId);
    if (!_.contains(post.attendees,username)) {
      Posts.update({_id:postId},
      {
        $addToSet: {attendees:username}
      });
    }else{
      Posts.update({_id:postId},
      {
        $pull: {attendees:username}
      });
    }
  }
      
  
});

createPost = function(postAttributes){
  Meteor.call('post', postAttributes, function(error, id) {
    if (error) {
      // display the error to the user
      throwError(error.reason);
    } else {
      Meteor.Router.to('postPage', id);
    }
  });
}
