this.RestPost = {
  // Bubbles
  createBubble: function(ctx, bubble) {
    return _.extend(
      _.pick(bubble, 'id', 'title', 'description', 'category', 'coverPhoto', 'retinaCoverPhoto', 'profilePicture', 'retinaProfilePicture', 'bubbleType'), {
      submitted: new Date().getTime(),
      lastUpdated: new Date().getTime(),
      users: {
        applicants: [],
        invitees: [],
        members: [],
        admins: [ctx.userId]
      }
    });
  }
};