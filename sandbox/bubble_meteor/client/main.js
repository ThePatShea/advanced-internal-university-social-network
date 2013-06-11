postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);

Deps.autorun(function() {
  // Meteor.subscribe('singlePost', Session.get('currentPostId'));
  
  Meteor.subscribe('comments', Session.get('currentPostId'));
	Meteor.subscribe('allUsers', Session.get('selectedUser'));
})

Meteor.subscribe('updates');
Meteor.subscribe('bubbles');
