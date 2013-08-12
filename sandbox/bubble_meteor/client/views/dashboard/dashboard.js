Template.dashboard.helpers({
	numBubbles: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({$or:
			[{'users.admins': {$in: [uid]}},
			{'users.members': {$in: [uid]}}
			]}).count();
		return numBubbles;
	},

	numInvites: function() {
		var uid = Meteor.userId();
		var numInvites = Bubbles.find({
			'users.invitees': {$in: [uid]}
		}).count();
		return numInvites;
	},

	numUpdates: function() {
		var uid = Meteor.userId();
		var numUpdates = Updates.find({
			userId: uid
		}).count();
		Session.set('numUpdates',numUpdates);
		return numUpdates;
	},

	numUpdatesMinusThree: function() {
		var uid = Meteor.userId();
		var numUpdates = Updates.find({
			userId: uid
		}).count();
		return (numUpdates-3);
	},

	showMoreUpdates: function() {
		var uid = Meteor.userId();
		var numUpdates = Updates.find({
			userId: uid
		}).count();

		if(numUpdates > 0)
			return true;
		else
			return false;
	},

	numComments: function() {
		var uid = Meteor.userId();
		var numComments = Comments.find({
			userId: uid
		}).count();
		return numComments;
	},

	numPosts: function() {
		var uid = Meteor.userId();
		var numPosts = Posts.find({
			userId: uid
		}).count();
		return numPosts;
	},

	numFiles: function() {
		var uid = Meteor.userId();
		var numFiles = Files.find({
			userId: uid
		}).count();
		return numFiles;
	},

	numEvents: function() {
		var uid = Meteor.userId();
		return Posts.find({'attendees': {$in: [Meteor.userId()]}}).count();
	},

	getUpdates: function(myLimit) {
		var uid = Meteor.userId();
		if(myLimit > 0) {
			return Updates.find({userId: uid},{limit: myLimit}).fetch();
		}
		else {
			return Updates.find({userId: uid}).fetch();
		}
	}
});

Template.dashboard.rendered = function () {
	$('.carousel').carousel();
	$('.dashboard-more-updates').click(function(){
		$('.threeUpdtes').addClass('visible-0');
		$('.allUpdates').removeClass('visible-0');
		$('.dashboard-more-updates').addClass('visible-0');
		$('.dashboard-updates').css('height',(75*Session.get('numUpdates'))+'px');
	});
};