// postsHandle = Meteor.subscribeWithPagination('posts');

commentsHandle = Meteor.subscribeWithPagination('comments',10);
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles',10);
eventListHandle = Meteor.subscribeWithPagination('events',10);
discussionListHandle = Meteor.subscribeWithPagination('discussions',10);
fileListHandle = Meteor.subscribeWithPagination('files',10);

Deps.autorun(function() {
	//Retrieves Bubbles
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('invitedBubbles', Meteor.userId());
  joinedBubblesHandle = Meteor.subscribeWithPagination('joinedBubbles', Meteor.userId(), 4);

  
  Meteor.subscribe('singlePost', Session.get('currentPostId'));
  Meteor.subscribe('comments', Session.get('currentPostId'));

  //Retrieves Users
	Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
											Session.get('inviteeList'+Session.get('currentBubbleId')));
	Meteor.subscribe('findUsersByName', Session.get('selectedUsername'));
})

Meteor.subscribe('updates');
