this.RestPost = {
  // Bubbles
  createBubble: function(ctx, bubble) {
    return _.extend(
      _.pick(bubble, 'id', 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'),
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

  createExplore: function(ctx, explore) {
    return _.extend(
      _.pick(exploreAttributes, 'id', 'title', 'description', 'exploreType', 'coverPhoto', 'retinaCoverPhoto', 'exploreProfileIconName', 'exploreIcon'),
      {
        submitted: new Date().getTime(),
        lastUpdated: new Date().getTime()
    });
  },

  createComment: function(ctx, comment) {
    var currentTime = new Date().getTime();

    Posts.update(comment.postId, {$set: {lastCommentTime: currentTime}, $inc: {commentsCount: 1}});

    return _.extend(
      _.pick(commentAttributes, 'postId', 'body'),
      {
        userId: user._id,
        author: user.name,
        submitted: currentTime
    });
  }
};