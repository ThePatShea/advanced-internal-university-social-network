Template.commentsList.helpers({
  comments: function() {
    return Comments.find({postId: this._id},{limit: commentsHandle.limit()});
  }
});

Template.commentsList.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      this.commentsHandle.loadNextPage();
    }
  });
}