postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles',5);


Deps.autorun(function() {
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('singlePost', Session.get('currentPostId'));
  Meteor.subscribe('comments', Session.get('currentPostId'));
	Meteor.subscribe('findOneUser', Session.get('selectedUserId'));
	Meteor.subscribe('findUsersByName', Session.get('selectedUsername'), Session.get('currentBubbleId'));
})

Meteor.subscribe('updates');

