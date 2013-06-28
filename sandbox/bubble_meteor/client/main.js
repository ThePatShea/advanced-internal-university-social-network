//For Comments
commentsHandle = Meteor.subscribeWithPagination('comments', Session.get('currentPostId'), Meteor.userId(), 10);

//For Posts
eventListHandle = Meteor.subscribeWithPagination('events', Session.get('currentBubbleId'), Meteor.userId(), 10);
discussionListHandle = Meteor.subscribeWithPagination('discussions', Session.get('currentBubbleId'), Meteor.userId(), 10);
fileListHandle = Meteor.subscribeWithPagination('files', Session.get('currentBubbleId'), Meteor.userId(), 10);

//For Bubbles
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles', 10);

Deps.autorun(function() {
	//Retrieves Bubbles
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('invitedBubbles', Meteor.userId());
  Meteor.subscribe('joinedBubbles', Meteor.userId());

  Meteor.subscribe('comments', Session.get('currentPostId'));

  //Retrieves Users
	Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
											Session.get('inviteeList'+Session.get('currentBubbleId')));
	usersListHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 10);
});

Meteor.subscribe('updates', Meteor.userId());
