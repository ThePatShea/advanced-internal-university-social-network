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
		if(Meteor.userId() && (Meteor.user())._id == profileId){
			return true;
		}
		else{
			return false;
		}
	},
	getUserType: function() {
		console.log(Meteor.users.findOne({_id:Session.get('selectedUserId')}));
		return Meteor.users.findOne({_id:Session.get('selectedUserId')}).userType;
	}

});