Template.commentSubmit.events({
  'submit form': function(event, template) {
    event.preventDefault();
    
    var comment = {
      body: $(event.target).find('[name=body]').val(),
      postId: template.data._id
    };
    
    Meteor.call('comment', comment, function(error, commentId) {
      error && throwError(error.reason);
    });

    var post = Posts.findOne(template.data._id);
 
    // sendEmail(post.userId, 'A new reply for your comment', 'This is the content for the email that states that there is a new reply for your comment');
    sendEmail(post.userId, 'A new reply for your comment', '<html><div style="background: red; color: blue;">Hi people!!!!</div></html>');

  }
});