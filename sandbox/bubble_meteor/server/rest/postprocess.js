this.RestPost = {
  // Bubbles
  createBubble: function(ctx, obj) {
    return _.extend(
      _.pick(obj, '_id', 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'),
      {
        submitted: new Date().getTime(),
        lastUpdated: new Date().getTime(),
        users: {
          applicants: [],
          invitees: [],
          members: [],
          admins: [ctx.userId]
        }
    });
  },

  // Explores
  createExplore: function(ctx, obj) {
    return _.extend(
      _.pick(obj, '_id', 'title', 'description', 'exploreType', 'coverPhoto', 'retinaCoverPhoto', 'exploreProfileIconName', 'exploreIcon'),
      {
        submitted: new Date().getTime(),
        lastUpdated: new Date().getTime()
    });
  },

  // Comments
  preComment: function(ctx, obj) {
    var currentTime = new Date().getTime();

    return _.extend(
      _.pick(commentAttributes, 'postId', 'body'),
      {
        userId: ctx.user._id,
        author: ctx.user.name,
        submitted: currentTime
    });
  },

  postComment: function(ctx, obj) {
    Posts.update(obj.postId, {$set: {lastCommentTime: currentTime}, $inc: {commentsCount: 1}});
  },

  // Posts
  createPost: function(ctx, obj) {
    var post = _.extend(
      _.pick(obj, '_id', 'postAsType', 'postAsId', 'postType', 'name', 'body', 'file', 'fileType', 'fileSize', 'fileUrl', 'dateTime', 'location', 'bubbleId', 'exploreId', 'attendees', 'eventPhoto', 'numDownloads', 'parent', 'children', 'lastDownloadTime', 'files'),
      {
        userId: ctx.user._id,
        author: ctx.user.name,
        submitted: new Date().getTime(),
        lastUpdated: new Date().getTime(),
        lastCommentTime: new Date().getTime(),
        commentsCount: 0,
        flagged: false,
        viewList: [ctx.user._id],
        viewCount: 1
    });

    if (!post.attendees)
      post.attendees = [];

    if (!post.children)
      post.children = [];

    if (!post.files)
      post.files = [];

    return post;
  },

  processPost: function(ctx, obj) {
    createPostUpdate(obj);

    var key = null;
    if (obj.bubbleId) {
      key = 'bubbleId';
    } else
    if (obj.exploreId) {
      key = 'exploreId';
    }

    var ids = [];

    for (var i in obj.files) {
      var fileId = obj.files[i];

      var file = RestHelpers.mongoFindOne(Files, fileId);

      // TODO: Better error logging
      if (!file) {
        console.log("Failed to get file by ID")
        continue;
      }

      var newObj = {
        id: new Meteor.Collection.ObjectID().toHexString(),
        name: escape(file.name),
        file: fileId,
        fileType: file.type,
        fileSize: file.size,
        fileUrl: file.url,
        postType: 'file',
        numDownloads: 0,
        lastDownloadTime: new Date().getTime(),
        author: obj.author,
        parent: obj._id
      };

      // Copy bubbleId/exploreId, etc
      if (key)
        newObj[key] = obj[key];

      var file = RestPost.createPost(ctx, newObj);

      var doc = RestHelpers.toMongoModel(newObj);
      // TODO: Error checks
      RestHelpers.mongoInsert(Posts, doc);
      ids.push(doc._id);
    }

    if (ids.length) {
      // TODO: Error checking
      RestHelpers.mongoUpdate(Posts, obj._id, {
        $set: {
          children: ids
        }
      });
    }
  },

  deletePost: function(ctx, obj) {
    Updates.update({postId: postId}, {$set: {read: true}});

    if (ctx.userId != obj.userId)
      createPostDeletedUpdate(obj.userId, obj._id);
  },

  // Files
  postprocessFile: function(obj) {
    delete obj['body'];
    return RestHelpers.fromMongoModel(obj);
  }
};