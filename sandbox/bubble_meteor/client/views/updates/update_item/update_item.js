Template.updates.helpers({
  getPost: function(){
    return Posts.findOne(this.postId);
  }
});