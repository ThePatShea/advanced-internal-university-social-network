Posts = new Meteor.Collection('posts');

Posts.allow({
   update: ownsPost,
   remove: ownsPost
 });

Posts.deny({
  update: function(userId, post, fieldNames) {
    // may only edit the following fields:
    return (_.without(fieldNames, 'name', 'body', 'dateTime', 'location', 'file', 'fileType', 'lastCommentTime', 'lastUpdated', 'eventPhoto', 'retinaEventPhoto', 'numDownloads', 'children', 'flagged', 'lastDownloadTime').length > 0);
  }
});

Meteor.methods({
  post: function(postAttributes) {
    var user = Meteor.user();
    var postWithSameName = Posts.findOne({name: postAttributes.name, bubbleId: postAttributes.bubbleId});
    
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

    // check that there are no previous posts with the same title
    if (postAttributes.title && postWithSameName) {
      throw new Meteor.Error(302, 
        'This post has already been created', 
        postWithSameName._id);
    }

    if(!postAttributes.attendees){
      postAttributes.attendees = [];
    }

    // pick out the whitelisted keys
    var post = _.extend(_.pick(postAttributes, 'postType', 'name', 'body', 'file', 'fileType', 'fileSize', 'dateTime', 'location', 'bubbleId', 'attendees', 'eventPhoto', 'numDownloads', 'parent', 'children', 'lastDownloadTime'), {
      userId: user._id,
      author: user.username, 
      submitted: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      lastCommentTime: new Date().getTime(),
      commentsCount: 0,
      flagged: false,
      viewList: [user._id],
      viewCount: 1
    });

    post._id = Posts.insert(post);
    createPostUpdate(post);

    return post;
  },

  incViewCount: function(postId) {
    var user = Meteor.user();
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "You need to login");
    Posts.update({
      _id: postId, 
      viewList: {$nin: [Meteor.userId()]}
    }, {
      $addToSet: {viewList: Meteor.userId()},
      $inc: {viewCount: 1}
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
      //Create an update for user who are in the event
      createNewAttendeeUpdate(postId);
    }else{
      Posts.update({_id:postId},
      {
        $pull: {attendees:username}
      });
    }
  },
  getNumOfEvents: function(bubbleId, postType ) {
    return Posts.find({bubbleId: bubbleId, postType: postType}).count();
  }
});

createPost = function(postAttributes){
  Meteor.call('post', postAttributes, function(error, post) {
    if (error) {
      // display the error to the user
      throwError(error.reason);
    } else {
      Meteor.Router.to('postPage', post.bubbleId, post._id);
    }
  });
}

createPostWithAttachments = function(postAttributes, fileList){
  Meteor.call('post', postAttributes, function(error, post){
    if (error) {
      // display the error to the user
      throwError(error.reason);
    } else {
      var filepostIds = [];
      for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = (function(f){
          return function(e) {
            
            var attributes = {
              name: escape(f.name),
              file: e.target.result,
              fileType: f.type,
              postType: 'file',
              numDownloads: 0,
              lastDownloadTime: new Date().getTime(),
              bubbleId: Session.get('currentBubbleId'),
              parent: post._id   //This needs to be set to the ID of the post created above.
            };
            var parentid = post._id;
            Meteor.call('post', attributes, function(error, newPost){
              if(error){
                throwError(error.reason);
              }
              else{
                //filepostIds.push(id);
                var parentPost = Posts.findOne({_id: parentid});
                var childPosts = parentPost.children;
                if(childPosts == null){
                  childPosts = [];
                }
                childPosts.push(newPost._id);
                console.log(childPosts);
                var updatedProperties = {
                  children: childPosts
                };
                Posts.update(parentid, {$set: updatedProperties}, function(error){
                  if(error){
                    throwError(error.reason);
                  }
                });
              }
            });
          }
        })(f);
        reader.readAsDataURL(f);
      }

      Meteor.Router.to('postPage', post.bubbleId, post._id);

    }
  });
}
