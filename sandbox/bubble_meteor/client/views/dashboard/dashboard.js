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
		return numUpdates;
	},

	numComments: function() {
		var uid = Meteor.userId();
		var numComments = Comments.find({
			userId: uid
		}).count();
		return numComments;
	},

	getUpdates: function(limit) {
		var uid = Meteor.userId();
		return Updates.find({userId: uid},{limit: limit}).fetch();
	}
});