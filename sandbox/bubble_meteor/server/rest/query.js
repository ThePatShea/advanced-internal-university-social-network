this.RestQuery = {
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
  }
};
