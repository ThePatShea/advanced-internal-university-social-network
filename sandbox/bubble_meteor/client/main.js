
// Bubble Related Subscriptions
  mainBubblesHandle = Meteor.subscribeWithPagination('bubbles', 20);


// Updates Related Subscriptions
  Meteor.subscribe('updates', Meteor.userId());


// UserLog Related Subscriptions
	userLogHandle = Meteor.subscribeWithPagination('userLogs', 100);


// Flags Related Subscriptions
	solvedFlagsHandle = Meteor.subscribeWithPagination('solvedFlags', 10);
	unsolvedFlagsHandle = Meteor.subscribeWithPagination('unsolvedFlags', 10);
	mainFlagsHandle = Meteor.subscribeWithPagination('allFlags', 10);

Deps.autorun(function() {

	// Bubble Related Subscriptions
		Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
		Meteor.subscribe('invitedBubbles', Meteor.userId());
		Meteor.subscribe('joinedBubbles', Meteor.userId());
		searchBubblesHandle = Meteor.subscribeWithPagination('searchBubbles', Session.get('searchText'), 10);


	// Comments Related Subscriptions
	  Meteor.subscribe('comments', Session.get('currentPostId'));
		commentsHandle = Meteor.subscribeWithPagination('comments', Session.get('currentPostId'), Meteor.userId(), 10);


	// Meteor Users Related Subscriptions 
		Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
												Session.get('inviteeList'+Session.get('currentBubbleId')));
		usersListHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 10);
		Meteor.subscribe('userData', Meteor.userId());
		Meteor.subscribe('userData', Session.get('selectedUserId'));


	// Posts Related Subscriptions
		postsListHandle = Meteor.subscribeWithPagination('posts', Session.get('currentBubbleId'), 10);
		if(Meteor.user() && 'superuser' == Meteor.user().userType){
			Meteor.subscribe('flaggedPosts');
		}


	// Retrieves searched Posts
		if( Meteor.user() && 'superuser' == Meteor.user().userType){
			searchEventsHandle = Meteor.subscribeWithPagination('superSearchEvents', Session.get('searchText'), 10);
			searchDiscussionsHandle = Meteor.subscribeWithPagination('superSearchDiscussions', Session.get('searchText'), 10);
			searchFilesHandle = Meteor.subscribeWithPagination('superSearchFiles', Session.get('searchText'), 10);
		}else{
			searchEventsHandle = Meteor.subscribeWithPagination('searchEvents', Session.get('searchText'), Meteor.userId, 10);
			searchDiscussionsHandle = Meteor.subscribeWithPagination('searchDiscussions', Session.get('searchText'), Meteor.userId, 10);
			searchFilesHandle = Meteor.subscribeWithPagination('searchFiles', Session.get('searchText'), Meteor.userId, 10);
		}
});
