postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);

Deps.autorun(function() {
  Meteor.subscribe('comments', Session.get('currentPostId'));
	Meteor.subscribe('findOneUser', Session.get('selectedUser'));
	Meteor.subscribe('findUsersByName', Session.get('selectedUsernames'));
})

Meteor.subscribe('updates');
Meteor.subscribe('bubbles');

