
mainBubblesHandle = Meteor.subscribeWithPagination('bubbles', 20);


Deps.autorun(function() {
	//Retrieves Bubbles
  Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
  Meteor.subscribe('invitedBubbles', Meteor.userId());
  Meteor.subscribe('joinedBubbles', Meteor.userId());
	searchBubblesHandle = Meteor.subscribeWithPagination('searchBubbles', Session.get('searchText'), 10);

  Meteor.subscribe('comments', Session.get('currentPostId'));

  //Retrieves Users
	Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
											Session.get('inviteeList'+Session.get('currentBubbleId')));
	usersListHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 10);

	//Retrieves Posts related to current bubble
	postsListHandle = Meteor.subscribeWithPagination('posts', Session.get('currentBubbleId'), 2);
	//Retrieves searched Posts
	if( Meteor.user() && 'superuser' == Meteor.user().userType){
		searchEventsHandle = Meteor.subscribeWithPagination('superSearchEvents', Session.get('searchText'), 10);
		searchDiscussionsHandle = Meteor.subscribeWithPagination('superSearchDiscussions', Session.get('searchText'), 10);
		searchFilesHandle = Meteor.subscribeWithPagination('superSearchFiles', Session.get('searchText'), 10);
	}else{
		searchEventsHandle = Meteor.subscribeWithPagination('searchEvents', Session.get('searchText'), Meteor.userId, 10);
		searchDiscussionsHandle = Meteor.subscribeWithPagination('searchDiscussions', Session.get('searchText'), Meteor.userId, 10);
		searchFilesHandle = Meteor.subscribeWithPagination('searchFiles', Session.get('searchText'), Meteor.userId, 10);
	}
		
	//Retrieves Comments
	commentsHandle = Meteor.subscribeWithPagination('comments', Session.get('currentPostId'), Meteor.userId(), 10);
	Meteor.subscribe('userData', Meteor.userId());
});

Meteor.subscribe('updates', Meteor.userId());