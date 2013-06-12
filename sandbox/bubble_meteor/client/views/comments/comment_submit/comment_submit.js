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
    Session.set('selectedUser', post.userId); 
    var user = Meteor.users.findOne(Session.get('selectedUser'));
    // console.log(Meteor.users.findOne(Session.get('selectedUser')).emails[0].address);
    if (user) {
      Meteor.call( 'sendEmail',
        user.emails[0].address,
        'A new reply for your comment',
        'This is the content for the email that states that there is a new reply for your comment'
      );
    }else{
      console.log("User is undefined for sending emails");
    }
  }
});