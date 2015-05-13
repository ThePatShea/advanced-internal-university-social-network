Template.commentsList.helpers({
  comments: function() {
    return Comments.find({postId: this._id},{sort: {submitted: 1}});
  }
});

Template.commentsList.rendered = function() {
  $('.btn-add').click(function() {
    $('[name=body]').focus();
  });
}
