

// Bubble Related Subscriptions
  mainBubblesHandle = Meteor.subscribeWithPagination('bubbles', 20);

Deps.autorun(function() {

	// Bubble Related Subscriptions
		Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
		invitedBubblesHandle = Meteor.subscribeWithPagination('invitedBubbles', Meteor.userId(), 10);
		joinedBubblesHandle = Meteor.subscribeWithPagination('joinedBubbles', Meteor.userId(), 20);
		searchBubblesHandle = Meteor.subscribeWithPagination('searchBubbles', Session.get('searchText'), 10);
		// Meteor.subscribe('allBubbles', Meteor.userId());


	// Comments Related Subscriptions
	  Meteor.subscribe('comments', Session.get('currentPostId'));
		commentsHandle = Meteor.subscribeWithPagination('comments', Session.get('currentPostId'), Meteor.userId(), 10);


	// Meteor Users Related Subscriptions 
		usersListHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 10);
		Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
												Session.get('inviteeList'+Session.get('currentBubbleId')));
		Meteor.subscribe('singleUser', Meteor.userId());
		Meteor.subscribe('singleUser', Session.get('selectedUserId'));
		Meteor.subscribe('findUsersById', Session.get('selectedUserIdList'));
		//Mega users need to have access to all users for analytics
		if(Meteor.user() && Meteor.user().userType == 'megauser'){
			mainUsersHandle = Meteor.subscribeWithPagination('allUsers');
		};



	// Posts Related Subscriptions
		Meteor.subscribe('singlePost', Session.get('currentPostId'));
		eventsHandle = Meteor.subscribeWithPagination('events', Session.get('currentBubbleId'), 10);
		discussionsHandle = Meteor.subscribeWithPagination('discussions', Session.get('currentBubbleId'), 10);
		filesHandle = Meteor.subscribeWithPagination('files', Session.get('currentBubbleId'), 10);
		if(Meteor.user() && '3' == Meteor.user().userType){
			flaggedPostsHandle = Meteor.subscribeWithPagination('flaggedPosts',10);
		}


	// Retrieves searched Posts
		Meteor.subscribe('updatedPosts', Meteor.userId());
		if( Meteor.user() && '3' == Meteor.user().userType){
			searchEventsHandle = Meteor.subscribeWithPagination('megaSearchEvents', Session.get('searchText'), 10);
			searchDiscussionsHandle = Meteor.subscribeWithPagination('megaSearchDiscussions', Session.get('searchText'), 10);
			searchFilesHandle = Meteor.subscribeWithPagination('megaSearchFiles', Session.get('searchText'), 10);
		}else{
			searchEventsHandle = Meteor.subscribeWithPagination('searchEvents', Session.get('searchText'), Meteor.userId, 10);
			searchDiscussionsHandle = Meteor.subscribeWithPagination('searchDiscussions', Session.get('searchText'), Meteor.userId, 10);
			searchFilesHandle = Meteor.subscribeWithPagination('searchFiles', Session.get('searchText'), Meteor.userId, 10);
		}


	// UserLog Related Subscriptions
		currentUserLogsHandle = Meteor.subscribeWithPagination('currentUserlogs', Meteor.userId(), 10);
		if(Meteor.user() && 'megauser' == Meteor.user().userType) {
			mainUserLogsHandle = Meteor.subscribeWithPagination('allUserlogs', 10);
		}


	// Updates Related Subscriptions
	  mainUpdatesHandle = Meteor.subscribeWithPagination('updates', Meteor.userId(), 1);


	// Flags Related Subscriptions
		if(Meteor.user() && Meteor.user().userType == '3'){
			solvedFlagsHandle = Meteor.subscribeWithPagination('solvedFlags', 10);
			unsolvedFlagsHandle = Meteor.subscribeWithPagination('unsolvedFlags', 10);
			mainFlagsHandle = Meteor.subscribeWithPagination('allFlags', 10);
		}
});
