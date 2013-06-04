Meteor.subscribeWithPagination('posts', 10);
Meteor.subscribe('comments');

Deps.autorun(function() {
  Meteor.subscribe('comments', Session.get('currentPostId'));
});

Meteor.subscribe('notifications');
