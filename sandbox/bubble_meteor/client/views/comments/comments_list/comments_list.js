Template.commentsList.helpers({
  comments: function() {
    if(typeof this._id == 'undefined'){
      this._id = this.id;
    }
    else{
      this.id = this._id;
    }
    /*if(typeof this._id !== "undefined")
      return Comments.find({postId: this._id},{sort: {submitted: 1}});*/
    return Comments.find({postId: this.id}, {sort: {submitted: 1}}).fetch();
  }
});

Template.commentsList.rendered = function() {

  $('.btn-add').click(function() {
    //Checks if "add comment" button hides or shows comment text input
    if($('.btn-add').attr('class').indexOf('collapsed') == -1){
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-addCommentButton' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }else{
      //Logs the action that user is doing
      Meteor.call('createLog', 
        { action: 'click-cancelAddCommentButton' }, 
        window.location.pathname, 
        function(error) { if(error) { throwError(error.reason); }
      });
    }

    $('[name=body]').focus();
  });
}
