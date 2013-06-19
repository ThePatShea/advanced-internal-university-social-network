postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);


Deps.autorun(function() {
  Meteor.subscribe('comments', Session.get('currentPostId'));
	Meteor.subscribe('findOneUser', Session.get('selectedUserId'));
	Meteor.subscribe('findUsersByName', Session.get('selectedUsername',Session.get('currentUserId')));
})

Meteor.subscribe('updates');
Meteor.subscribe('bubbles');

