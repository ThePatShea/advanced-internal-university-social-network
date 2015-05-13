Template.fileData.helpers({
  currentPost: function() {
    post = Posts.findOne(Session.get('currentPostId'));
    return post;
  }
});