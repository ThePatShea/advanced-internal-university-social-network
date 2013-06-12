postsHandle = Meteor.subscribeWithPagination('posts', 15);
commentsHandle = Meteor.subscribeWithPagination('comments',10);

Deps.autorun(function() {
  Meteor.subscribe('comments', Session.get('currentPostId'));
	Meteor.subscribe('findOneUser', Session.get('selectedUser'));
})

Meteor.subscribe('updates');
Meteor.subscribe('bubbles');

Meteor.startup(function () {
  // process.env.MAIL_URL = 'smtp://postmaster%40meteorize.mailgun.org:YOURPASSWORD@smtp.mailgun.org:587';
});