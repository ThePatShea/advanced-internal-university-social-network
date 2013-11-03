this.RestQuery = {
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
