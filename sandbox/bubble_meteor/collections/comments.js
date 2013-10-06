Comments = new Meteor.Collection('comments');

Comments.allow({
   update: ownsComment,
   remove: ownsComment
 });

Meteor.methods({
  comment: function(commentAttributes) {
    var user = Meteor.user();
    var post = Posts.findOne(commentAttributes.postId);
    // ensure the user is logged in
    if (!user)
      throw new Meteor.Error(401, "Please sign in to make comment");

    if (!commentAttributes.body)
      throw new Meteor.Error(422, 'Please type a message before submitting your comment');

    if (!commentAttributes.postId)
      throw new Meteor.Error(422, 'Please comment on a post');

    currentTime = new Date().getTime();

    comment = _.extend(_.pick(commentAttributes, 'postId', 'body'), {
      userId: user._id,
      author: user.name,
      submitted: currentTime
    });

    // update the post with the number of comments
    Posts.update(comment.postId, {$set: {lastCommentTime: currentTime}, $inc: {commentsCount: 1}});

    // create the comment, save the id
    comment._id = Comments.insert(comment);

    createCommentUpdate(comment);

    return comment._id;
  },

  deleteComment: function(commentId){
    var comment = Comments.findOne(commentId);
    Comments.remove(commentId);
    Posts.update({
      _id: comment.postId
    }, {
      $inc: {commentsCount: -1}
    });
    Updates.update({commentId: commentId}, {$set: {read: true}});
  }
});

