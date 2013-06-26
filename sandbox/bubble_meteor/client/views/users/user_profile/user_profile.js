Template.userProfile.helpers({
	getUser: function() {
		return Meteor.users.findOne({_id:Session.get('selectedUserId')});
	},

	getUserId: function() {
		return Session.get('selectedUserId');
	},

	getBubblesList: function(){
		return Bubbles.find({'users.admins':this._id});
	},

	getEmail: function(){
		return this.emails[0].address;
	},

	getProfilePicture: function(){
		var user = Meteor.users.findOne({_id:Session.get('selectedUserId')});
		console.log('The User object: ',user);
		return user.profilePicture;
	},

	hasPermission: function(){
		var profileId = Session.get('selectedUserId');
		//console.log(Meteor.user(), profileId);
		if((Meteor.user())._id == profileId){
			return true;
		}
		else{
			return false;
		}
	}

});