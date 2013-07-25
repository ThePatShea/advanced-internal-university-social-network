Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getUserId: function() {
		return Session.get('selectedUserId');
	},

	getBubblesAdminList: function() {
		return Bubbles.find({'users.admins':this._id});
	},

	getBubblesMemberList: function() {
		return Bubbles.find({'users.members':this._id});
	},

	getBubbleAdminsCount: function() {
		var bubbles = Bubbles.find({'users.admins':this._id});
		return bubbles.count();
	},

	numBubbles: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({$or:
			[{'users.admins': {$in: [uid]}},
			{'users.members': {$in: [uid]}}
			]}).count();
		return numBubbles;
	},

	numAdmins: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({'users.admins': {$in: [uid]}}).count();
		return numBubbles;
	},

	numMembers: function() {
		var uid = Meteor.userId();
		var numBubbles = Bubbles.find({'users.members': {$in: [uid]}}).count();
		return numBubbles;
	},

	numPosts: function() {
		var uid = Meteor.userId();
		var numPosts = Posts.find({'userId': uid}).count();
		return numPosts;
	},

	getEmail: function() {
		return this.emails[0].address;
	},

	getProfilePicture: function(){
		var user = Meteor.users.findOne({_id:Session.get('selectedUserId')});
		return user.profilePicture;
	},
	hasPermission: function() {
		var profileId = Session.get('selectedUserId');
		//Checks if user is lvl 4 or if user is viewing own profile
		if('4' == Meteor.user().userType ||  Meteor.userId() == profileId) {
			return true;
		}
		else{
			return false;
		}
	},
	getUserType: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')}).userType;
	}
});
