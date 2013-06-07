Template.discussionEdit.helpers({
  post: function() {
    return Posts.findOne(Session.get('currentPostId'));
  }
});

Template.discussionEdit.events({
  'submit form': function(e) {
    e.preventDefault();
    
    var currentPostId = Session.get('currentPostId');
    
    var postProperties = {
      name: $(e.target).find('[name=name]').val(),
      body: $(e.target).find('[name=body]').val(),
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
      Meteor.Router.to('/'+Session.get("sortPostBy"));
    }
  }
});
