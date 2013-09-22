Template.commentsList.helpers({
  comments: function() {
    return Comments.find({postId: this._id},{sort: {submitted: 1}});
  }
});

Template.commentsList.rendered = function() {

  $('.btn-add').click(function() {
    if($('.btn-add').attr('class').indexOf('collapsed') == -1){
      //Logs when user clicks on add new comment
      Meteor.call('createLog',  "postPage", 'newComment', 'addCommentButton', false);
    }else{
      //Logs when user clicks on cancel add new comment
      Meteor.call('createLog',  "postPage", 'newComment', 'cancelAddCommentButton', false);
    }

    $('[name=body]').focus();
  });
}
