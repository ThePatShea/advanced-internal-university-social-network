Template.newPosts.helpers({
  options: function() {
    Session.set("sortPostBy","new");
    return {
      sort: {submitted: -1},
      handle: newPostsHandle
    }
  }
});

Template.bestPosts.helpers({
  options: function() {
    Session.set("sortPostBy","best");
    return {
      sort: {votes: -1, submitted: -1},
      handle: bestPostsHandle
    }
  }
});

Template.postsList.helpers({
  postsWithRank: function() {
    var i = 0, options = {sort: this.sort, limit: this.handle.limit()};
    return Posts.find({}, options).map(function(post) {
      post._rank = i;
      i += 1;
      return post;
    });
  },

  postsReady: function() {
    return this.handle.ready();
  },

  allPostsLoaded: function() {
    var loaded = Posts.find().count() < this.handle.loaded();
    Session.set("allPostsLoaded",loaded);
    return this.handle.ready() && loaded;
  }
});

Template.postsList.events({
  'click .load-more': function(event) {
    event.preventDefault();
    this.handle.loadNextPage();
  }
});

Template.postsList.rendered = function(){
  $(window).scroll(function(){
    if ($(window).scrollTop() == $(document).height() - $(window).height()){
      var handle;
      if (Session.get("sortPostBy")=="new"){
        handle = this.newPostsHandle;
      }else{
        handle = this.bestPostsHandle;
      }
      if (!Session.get("allPostsLoaded")){
        handle.loadNextPage();
      }
    }
  });
}
