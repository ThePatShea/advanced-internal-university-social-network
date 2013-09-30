Template.commentsList.helpers({
  comments: function() {
    if(typeof this._id !== "undefined")
      return Comments.find({postId: this._id},{sort: {submitted: 1}});
    return Comments.find({postId: this.id}, {sort: {submitted: 1}});
  }
});

Template.commentsList.rendered = function() {

  $('.btn-add').click(function() {
    //Checks if "add comment" button hides or shows comment text input
    if($('.btn-add').attr('class').indexOf('collapsed') == -1){
      //Logs when user clicks on add new comment
      Meteor.call('createLog',  "postPage", 'comment', 'addCommentButton', false);
    }else{
      //Logs when user clicks on cancel add new comment
      Meteor.call('createLog',  "postPage", 'comment', 'cancelAddCommentButton', false);
    }

    $('[name=body]').focus();
  });
}
