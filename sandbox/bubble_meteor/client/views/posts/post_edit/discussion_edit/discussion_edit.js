Template.discussionEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = Session.get('currentPostId');
    var dateTime = $(event.target).find('[name=date]').val() + " " + $(event.target).find('[name=time]').val();

    var postProperties = {
      dateTime: dateTime,
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('.wysiwyg').html(),
      lastUpdated: new Date().getTime()
    }

    Posts.update(currentPostId, {$set: postProperties}, function(error) {
      if (error) {
        // display the error to the user
        throwError(error.reason);
      } else {
        Meteor.Router.to('postPage', currentPostId);
      }
    });
  },
  
  'click .delete': function(e) {
    e.preventDefault();
    if (confirm("Delete this post?")) {
      var currentPostId = Session.get('currentPostId');
      Posts.remove(currentPostId);
      Meteor.Router.to('bubblePage',Session.get('currentBubbleId'));
    }
  }
});
