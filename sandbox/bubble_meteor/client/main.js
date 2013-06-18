postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);


Deps.autorun(function() {
  Meteor.subscribe('comments', Session.get('currentPostId'));
  //subscription
  Meteor.subscribe('findUsersByName');
  
	Meteor.subscribe('findOneUser', Session.get('selectedUser'));
	//Meteor.subscribe('findUsersByName', Session.get('selectedUsername'));
})

Meteor.subscribe('updates');
Meteor.subscribe('bubbles');

