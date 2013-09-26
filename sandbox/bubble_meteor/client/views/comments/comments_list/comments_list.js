Template.commentsList.helpers({
  comments: function() {
    return Comments.find({postId: this._id},{sort: {submitted: 1}});
  }
});

Template.commentsList.rendered = function() {

  $('.btn-add').click(function() {
    //Checks if "add comment" button hides or shows comment text input
    if($('.btn-add').attr('class').indexOf('collapsed') == -1){
      //Logs when user clicks on add new comment
      Meteor.call('createLog', Meteor.Router.page(), 'createComment', 'addCommentButton');
    }else{
      //Logs when user clicks on cancel add new comment
      Meteor.call('createLog', Meteor.Router.page(), 'createComment', 'cancelAddCommentButton');
    }

    $('[name=body]').focus();
  });
}
