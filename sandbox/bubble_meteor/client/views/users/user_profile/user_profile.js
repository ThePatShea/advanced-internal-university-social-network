Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getUserId: function() {
		return Session.get('selectedUserId');
	},

	getBubblesList: function() {
		return Bubbles.find({'users.admins':this._id});
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