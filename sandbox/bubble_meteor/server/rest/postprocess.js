this.RestPost = {
  // Bubbles
  createBubble: function(ctx, obj) {
    return _.extend(
      _.pick(obj, 'id', 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'),
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
      _.pick(obj, 'id', 'title', 'description', 'exploreType', 'coverPhoto', 'retinaCoverPhoto', 'exploreProfileIconName', 'exploreIcon'),
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
      _.pick(obj, 'id', 'postAsType', 'postAsId', 'postType', 'name', 'body', 'file', 'fileType', 'fileSize', 'dateTime', 'location', 'bubbleId', 'exploreId', 'attendees', 'eventPhoto', 'numDownloads', 'parent', 'children', 'lastDownloadTime'),
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

    return post;
  },

  processPost: function(ctx, obj) {
    createPostUpdate(obj);
  }
};