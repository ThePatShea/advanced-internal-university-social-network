this.RestQuery = {
  // Remove limit from the query
  noLimit: function(ctx, opts) {
    opts.noLimit = true;
    return opts;
  },

  // Posts
  filterBubblePosts: function(ctx, query) {
    query = query || {};
    query.bubbleId = {$exists: false};
    return query;
  },

  // Explores
  explorePostsFilter: function(ctx, query) {
    query = query || {};

    if (ctx.parentDoc.exploreType === 'event') {
      query.dateTime = {
        $gte: new Date().getTime()
      };
    }

    return query;
  },

  explorePostsOrder: function(ctx, opts) {
    // TODO: Do not override?
    if (ctx.parentDoc.exploreType === 'discussion') {
      opts.sort = {submitted: -1};
    } else {
      opts.sort = {dateTime: 1};
    }

    return opts;
  },

  // Bubbles
  buildBubblePostFilter: function(name) {
    return function(ctx, query) {
      query = query || {};
      query.postType = name;
      return query;
    };
  },

  buildBubbleUserQuery: function(name) {
    return function(ctx) {
      var bubble = RestHelpers.mongoFindOne(Bubbles, ctx.params.parentId);

      var bubbleUserIds = bubble.users[name];

      return {
        _id: {
          $in: bubbleUserIds
        }
      };
    };
  },

  bubbleEventFilter: function(ctx, query) {
    query = query || {};
    return _.extend(query, {
      postType: 'event',
      dateTime: {
        $gte: new Date().getTime()
      }
    });
  },

  bubbleEventOrder: function(ctx, opts) {
    opts.sort = {dateTime: 1};
    return opts;
  },

  bubbleDiscussionOrder: function(ctx, opts) {
    opts.sort = {submitted: -1};
    return opts;
  },

  buildBubbleFileOrder: function(ctx, opts) {
    opts.sort = {submitted: -1};
    return opts;
  },

  // Users
  userFieldFilter: function(ctx, opts) {
    opts.fields = {
      createdAt: true,
      emails: true,
      name: true,
      userType: true,
      username: true,
      profilePicture: true
    };
    return opts;
  },

  userBubbleQuery: function(ctx, query) {
    query = query || {};
    query['$or'] = [
      {'users.members': ctx.userId},
      {'users.admins': ctx.userId}
    ];
    return query;
  },

  bubbleUserOrder: function(ctx, opts) {
    opts.sort = {
      'submitted': -1
    };
    opts.fields = {
      category: 1,
      title: 1
    };
    opts.limit = undefined;
    return opts;
  },

  // Files
  fileFieldFilter: function(ctx, opts) {
    opts.fields = {
      name: true,
      type: true,
      userId: true,
      size: true,
      url: true
    };
    return opts;
  }
};
