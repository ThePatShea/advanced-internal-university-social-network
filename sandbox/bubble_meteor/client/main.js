postsHandle = Meteor.subscribeWithPagination('posts', 3);
commentsHandle = Meteor.subscribeWithPagination('comments',10);
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles',3);
discussionListHandle = Meteor.subscribeWithPagination('posts',3);
eventListHandle = Meteor.subscribeWithPagination('posts',3);
fileListHandle = Meteor.subscribeWithPagination('posts',3);

Deps.autorun(function() {
	//Retrieves Bubbles
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('invitedBubbles', Meteor.userId());
  joinedBubblesHandle = Meteor.subscribeWithPagination('joinedBubbles', Meteor.userId(), 4);

  
  Meteor.subscribe('singlePost', Session.get('currentPostId'));
  Meteor.subscribe('comments', Session.get('currentPostId'));

  //Retrieves Users
	Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'));
	searchedUsersHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 4);
})

Meteor.subscribe('updates');

