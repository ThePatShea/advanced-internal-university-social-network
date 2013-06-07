newPostsHandle = Meteor.subscribeWithPagination('newPosts', 15);
// bestPostsHandle = Meteor.subscribeWithPagination('bestPosts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);

Deps.autorun(function() {
  Meteor.subscribe('singlePost', Session.get('currentPostId'));
  
  Meteor.subscribe('comments', Session.get('currentPostId'));
})

Meteor.subscribe('notifications');
Meteor.subscribe('bubbles');
