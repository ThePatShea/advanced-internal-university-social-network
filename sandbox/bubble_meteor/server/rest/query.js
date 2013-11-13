this.RestQuery = {
  // Generic helpers
  excludeFields: function(parser, fields) {
    return function(ctx) {
      var opts = parser(ctx);

      for (var n in fields) {
        var f = fields[n];

        opts.fields[f] = false;
      }

      return opts;
    };
  },

  noLimit: function(parser) {
    return function(ctx) {
      var opts = parser(ctx);
      opts.limit = undefined;
      return opts;
    };
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

  explorePostsOrder: function(apiOpts) {
    return function(ctx) {
      var opts = apiOpts(ctx);

      // TODO: Do not override?
      if (ctx.parentDoc.exploreType === 'discussion') {
        opts.sort = {submitted: -1};
      } else {
        opts.sort = {dateTime: 1};
      }

      return opts;
    };
  },

  // Bubbles
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

  // Users
  buildUserBubbleQuery: function() {
    return function(ctx) {
      return {
        $or: [
          {'users.members': ctx.userId},
          {'users.admins': ctx.userId}
        ]
      };
    };
  },

  bubbleUserOrder: function(apiOpts) {
    return function(ctx) {
      var opts = apiOpts(ctx);
      opts.sort = {
        'submitted': -1
      };
      opts.fields = {
        category: 1,
        title: 1
      };
      opts.limit = undefined;
      return opts;
    };
  }
};
