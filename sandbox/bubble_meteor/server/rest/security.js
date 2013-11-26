this.UserType = {
  USER: '1',
  SUPERUSER: '2',
  CAMPUSMOD: '3',
  BUBBLEMASTER: '4'
};

this.RestSecurity = {
  // Posts
  notBubbleCheck: function(ctx, obj) {
    if (obj && obj.bubbleId)
      return RestHelpers.jsonResponse(401, 'Bubble posts are disallowed');
  },

  ownsPost: function(ctx, obj) {
    if (typeof obj.bubbleId != 'undefined') {
      var bubble = RestHelpers.mongoFindOne(Bubbles, obj.bubbleId);
      if (!bubble)
        return RestHelpers.jsonResponse(422, 'Can only comment bubble posts');

      if (ctx.user.userType != UserType.ADMIN &&
          obj.userId != ctx.userId &&
          obj.author != ctx.user.userName &&
          !_.contains(bubble.users.admins, ctx.userId))
        return RestHelpers.jsonResponse(401, 'Not bubble post owner');
    } else {
      if (ctx.user.userType != UserType.ADMIN && obj.userId != ctx.userId)
        return RestHelpers.jsonResponse(401, 'Not post owner');
    }
  },

  canMakePost: function(fieldName) {
    return function(ctx, obj) {
      // Check if post has a name
      if (!obj.name)
        return RestHelpers.jsonResponse(422, 'Please fill in post name');

      var query = {
        name: obj.name
      };
      query[fieldName] = obj[fieldName];

      if (RestHelpers.mongoFindOne(Posts, query)) {
        return RestHelpers.jsonResponse(302, 'Duplicate post name');
      }

      switch (obj.postType) {
        case 'discussion':
          if (!obj.body)
            return RestHelpers.jsonResponse(422, 'Post body is required');
          break;
        case 'event':
          if (!obj.body || !obj.location)
            return RestHelpers.jsonResponse(422, 'Event body and location are required');
          break;
        case 'file':
          if (!obj.files)
            return RestHelpers.jsonResponse(422, 'Missing file');
          break;
        default:
          return RestHelpers.jsonResponse(422, 'Invalid post type');
      }
    }
  },

  canUpdatePost: function(ctx, obj) {
    var post = RestHelpers.mongoFindOne(Posts, obj.id);
    if (!post)
      return RestHelpers.jsonResponse(404, 'Post not found');

    var response = RestSecurity.ownsPost(ctx, obj);
    if (response)
      return response;

    // TODO: Prettify?
    var field = RestHelpers.haveChangedFields(obj, post, [
      'author', 'exploreId', 'postAsType', 'postAsId', 'dateTime', 'location',
      'file', 'fileType', 'fileSize', 'lastCommentTime', 'lastUpdated', 'eventPhoto', 'retinaEventPhoto',
      'numDownloads', 'children', 'flagged', 'lastDownloadTime']);
    if (field)
      return RestHelpers.jsonResponse(401, 'Not allowed to change core field ' + field);
  },

  // Explores
  isUniqueExplore: function(ctx, obj) {
    if (!obj.title || !obj.title.length)
      return RestHelpers.jsonResponse(422, 'Please fill in a headline');

    if (RestHelpers.mongoFindOne(Bubbles, {title: obj.title}))
      return RestHelpers.jsonResponse(302, 'This explore has already been created');
  },

  ownsExplore: function(ctx, obj) {
    // TODO: Fixed
  },

  isExploreAdmin: function(ctx, obj) {
    if (ctx.user.userType != UserType.ADMIN)
      return RestHelpers.jsonResponse(401, 'Not admin');
  },

  // Bubbles
  isUniqueBubble: function(ctx, obj) {
    if (!obj.title || !obj.title.length)
      return RestHelpers.jsonResponse(422, 'Please fill in a headline');

    if (RestHelpers.mongoFindOne(Bubbles, {title: obj.title}))
      return RestHelpers.jsonResponse(302, 'This bubble has already been created');
  },

  isConnectedToBubble: function(ctx, obj) {
    if (ctx.user.userType == UserType.ADMIN)
      return;

    var bubble = RestHelpers.mongoFindOne(Bubbles, ctx.params.id);

    if (bubble && bubble.users) {
      if (_.contains(bubble.users.applicants, ctx.userId) ||
          _.contains(bubble.users.invitees, ctx.userId) ||
          _.contains(bubble.users.members, ctx.userId) ||
          _.contains(bubble.users.admins, ctx.userId))
        return;
    }

    return RestHelpers.jsonResponse(401, 'Not connected to bubble');
  },

  ownsBubble: function(ctx, obj) {
    if (ctx.user.userType === UserType.ADMIN)
      return;

    var bubble = RestHelpers.mongoFindOne(Bubbles, ctx.params.id);
    if (bubble && bubble.users && bubble.users.admins && _.contains(bubble.users.admins, ctx.userId))
      return;

    return RestHelpers.jsonResponse(401, 'Not bubble owner');
  },

  canUpdateBubble: function(ctx, obj) {
    if (ctx.user.userType === UserType.ADMIN)
      return;

    var bubble = RestHelpers.mongoFindOne(Bubbles, ctx.params.id);
    if (bubble && bubble.users && bubble.users.admins && _.contains(bubble.users.admins, ctx.userId))
      return;

    if (!_.contains(bubble.users.members, ctx.userId))
      return RestHelpers.jsonResponse(401, 'Not bubble member');

    // Figure out if user attempts to remove himself
    var copy = {
      'users.members': _.without(bubble.users.members, ctx.userId)
    };

    if (!_.isEqual(copy, obj))
      return RestHelpers.jsonResponse(401, 'Not allowed');
  },

  relatedBubbleExists: function(ctx) {
    var bubble = RestHelpers.mongoFindOne(Bubbles, ctx.params.parentId);
    if (!bubble)
      return RestHelpers.jsonResponse(404, 'Bubble does not exist');
  },

  // Bubble posts
  makeBubblePostCheck: function(name) {
    return function(ctx, obj) {
      if (obj && obj.postType != name)
        return RestHelpers.jsonResponse(401, 'Invalid post type');
    };
  },

  // Comments
  canCreateComment: function(ctx, obj) {
    if (!obj.postId)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    var post = RestHelpers.mongoFindOne(Posts, obj.postId);
    if (!post)
      return RestHelpers.jsonResponse(422, 'Please comment on post');
  },

  canChangeComment: function(ctx, obj) {
    if (!obj.postId)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    var post = RestHelpers.mongoFindOne(Posts, obj.postId);
    if (!post)
      return RestHelpers.jsonResponse(422, 'Please comment on post');

    if (!obj.bubbleId)
      return RestHelpers.jsonResponse(422, 'Can only comment bubble posts');

    var bubble = RestHelpers.mongoFindOne(Bubbles, obj.bubbleId);
    if (!bubble)
      return RestHelpers.jsonResponse(422, 'Can only comment bubble posts');

    var admins = bubble.users.admins;
    if (_.contains(bubble.users.admins, ctx.userId))
      return;

    if (post.userId == ctx.userId)
      return;

    return RestHelpers.jsonResponse(401, 'Can not edit others comment');
  },

  // Files
  canChangeFile: function(ctx, obj) {
    if (ctx.user.userType != UserType.ADMIN && obj.userId != ctx.userId)
      return RestHelpers.jsonResponse(403, 'Access denied.');
  },

  // Users
  relatedUserExists: function(ctx) {
    var user = RestHelpers.mongoFindOne(Meteor.users, ctx.params.parentId);
    if (!user)
      return RestHelpers.jsonResponse(404, 'User does not exist');

    if (user._id != ctx.userId)
      return RestHelpers.jsonResponse(403, 'Access denied.');
  },

  // Helpers
  deny: function(ctx, obj) {
    return RestHelpers.jsonResponse(403, 'Access denied.');
  }
};
