
// Bubble Related Subscriptions
  mainBubblesHandle = Meteor.subscribeWithPagination('bubbles', 20);


// Updates Related Subscriptions
  mainUpdatesHandle = Meteor.subscribeWithPagination('updates',50);


// Flags Related Subscriptions
	solvedFlagsHandle = Meteor.subscribeWithPagination('solvedFlags', 10);
	unsolvedFlagsHandle = Meteor.subscribeWithPagination('unsolvedFlags', 10);
	mainFlagsHandle = Meteor.subscribeWithPagination('allFlags', 10);

Deps.autorun(function() {

	// Bubble Related Subscriptions
		Meteor.subscribe('singleBubble', Session.get('currentBubbleId'));
		invitedBubblesHandle = Meteor.subscribeWithPagination('invitedBubbles', Meteor.userId(), 10);
		joinedBubblesHandle = Meteor.subscribeWithPagination('joinedBubbles', Meteor.userId(), 20);
		searchBubblesHandle = Meteor.subscribeWithPagination('searchBubbles', Session.get('searchText'), 10);
		Meteor.subscribe('allBubbles', Meteor.userId());


	// Comments Related Subscriptions
	  Meteor.subscribe('comments', Session.get('currentPostId'));
		commentsHandle = Meteor.subscribeWithPagination('comments', Session.get('currentPostId'), Meteor.userId(), 10);


	// Meteor Users Related Subscriptions 
		Meteor.subscribe('relatedUsers', Session.get('currentBubbleId'), Session.get('currentPostId'), 
												Session.get('inviteeList'+Session.get('currentBubbleId')));
		usersListHandle = Meteor.subscribeWithPagination('findUsersByName', Session.get('selectedUsername'), 10);
		Meteor.subscribe('userData', [Meteor.userId()]);
		Meteor.subscribe('userData', [Session.get('selectedUserId')]);
		Meteor.subscribe('userData', Session.get('selectedUserIdList'));
		var currentuserId = Meteor.userId();
		console.log('User Id: ', currentuserId);
		var user = Meteor.users.findOne({_id: currentuserId});
		Meteor.subscribe('allUsers', Meteor.userId());
		if(user.userType == 'superuser' || user.userType == 'megauser'){
			Meteor.subscribe('allUsers');
		};



	// Posts Related Subscriptions
		postsListHandle = Meteor.subscribeWithPagination('posts', Session.get('currentBubbleId'), 10);
		if(Meteor.user() && 'superuser' == Meteor.user().userType){
			flaggedPostsHandle = Meteor.subscribeWithPagination('flaggedPosts',10);
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


	// UserLog Related Subscriptions
		currentUserLogsHandle = Meteor.subscribeWithPagination('currentUserlogs', Meteor.userId(), 10);
		if(Meteor.user() && 'megauser' == Meteor.user().userType) {
			mainUserLogsHandle = Meteor.subscribeWithPagination('allUserlogs', 10);
		}
});
