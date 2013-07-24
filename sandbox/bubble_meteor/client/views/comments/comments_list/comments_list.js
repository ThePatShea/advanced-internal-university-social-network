Template.commentsList.helpers({
  comments: function() {
    return Comments.find({postId: this._id},{sort: {submitted: 1}});
  }
});
